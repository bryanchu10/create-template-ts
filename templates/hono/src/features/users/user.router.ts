import type { UserService } from "./user.service";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { match } from "ts-pattern";
import { toUserResponse } from "./user.handler";
import {
    CreateUserBodySchema,
    ErrorResponseSchema,
    UpdateUserBodySchema,
    UserIdParamSchema,
    UserResponseSchema,
} from "./user.schema";

const tags = ["Users"];

const errorResponses = {
    404: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Not found",
    },
    409: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Conflict",
    },
    422: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Validation error",
    },
    500: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Internal server error",
    },
} as const;

const listUsersRoute = createRoute({
    method: "get",
    path: "/",
    tags,
    summary: "List all users",
    responses: {
        200: {
            content: { "application/json": { schema: z.array(UserResponseSchema) } },
            description: "List of users",
        },
        500: errorResponses[500],
    },
});

const getUserRoute = createRoute({
    method: "get",
    path: "/{id}",
    tags,
    summary: "Get user by ID",
    request: { params: UserIdParamSchema },
    responses: {
        200: {
            content: { "application/json": { schema: UserResponseSchema } },
            description: "User found",
        },
        404: errorResponses[404],
        500: errorResponses[500],
    },
});

const createUserRoute = createRoute({
    method: "post",
    path: "/",
    tags,
    summary: "Create a new user",
    request: {
        body: {
            content: { "application/json": { schema: CreateUserBodySchema } },
            required: true,
        },
    },
    responses: {
        201: {
            content: { "application/json": { schema: UserResponseSchema } },
            description: "User created",
        },
        409: errorResponses[409],
        422: errorResponses[422],
        500: errorResponses[500],
    },
});

const updateUserRoute = createRoute({
    method: "patch",
    path: "/{id}",
    tags,
    summary: "Update a user",
    request: {
        params: UserIdParamSchema,
        body: {
            content: { "application/json": { schema: UpdateUserBodySchema } },
            required: true,
        },
    },
    responses: {
        200: {
            content: { "application/json": { schema: UserResponseSchema } },
            description: "User updated",
        },
        404: errorResponses[404],
        409: errorResponses[409],
        422: errorResponses[422],
        500: errorResponses[500],
    },
});

const deleteUserRoute = createRoute({
    method: "delete",
    path: "/{id}",
    tags,
    summary: "Delete a user",
    request: { params: UserIdParamSchema },
    responses: {
        204: { description: "User deleted" },
        404: errorResponses[404],
        500: errorResponses[500],
    },
});

export function createUserRouter(service: UserService) {
    const router = new OpenAPIHono({
        defaultHook(result, c) {
            if (!result.success) {
                const message = result.error.issues.map((i) => i.message).join(", ");

                return c.json({ message }, 422);
            }
        },
    });

    router.openapi(listUsersRoute, (c) => {
        const result = service.listUsers();
        if (result.isErr()) {
            return match(result.error)
                .with({ type: "USER_DATABASE_ERROR" }, () =>
                    c.json({ message: "Internal server error" }, 500))
                .exhaustive();
        }

        return c.json(result.value.map(toUserResponse), 200);
    });

    router.openapi(getUserRoute, (c) => {
        const { id } = c.req.valid("param");
        const result = service.getUserById(id);
        if (result.isErr()) {
            return match(result.error)
                .with({ type: "USER_NOT_FOUND" }, ({ id: uid }) =>
                    c.json({ message: `User ${uid} not found` }, 404))
                .with({ type: "USER_DATABASE_ERROR" }, () =>
                    c.json({ message: "Internal server error" }, 500))
                .exhaustive();
        }

        return c.json(toUserResponse(result.value), 200);
    });

    router.openapi(createUserRoute, (c) => {
        const body = c.req.valid("json");
        const result = service.createUser(body);
        if (result.isErr()) {
            return match(result.error)
                .with({ type: "USER_DUPLICATE_EMAIL" }, ({ email }) =>
                    c.json({ message: `Email ${email} is already taken` }, 409))
                .with({ type: "USER_DATABASE_ERROR" }, () =>
                    c.json({ message: "Internal server error" }, 500))
                .exhaustive();
        }

        return c.json(toUserResponse(result.value), 201);
    });

    router.openapi(updateUserRoute, (c) => {
        const { id } = c.req.valid("param");
        const body = c.req.valid("json");
        const result = service.updateUser(id, body);
        if (result.isErr()) {
            return match(result.error)
                .with({ type: "USER_NOT_FOUND" }, ({ id: uid }) =>
                    c.json({ message: `User ${uid} not found` }, 404))
                .with({ type: "USER_DUPLICATE_EMAIL" }, ({ email }) =>
                    c.json({ message: `Email ${email} is already taken` }, 409))
                .with({ type: "USER_DATABASE_ERROR" }, () =>
                    c.json({ message: "Internal server error" }, 500))
                .exhaustive();
        }

        return c.json(toUserResponse(result.value), 200);
    });

    router.openapi(deleteUserRoute, (c) => {
        const { id } = c.req.valid("param");
        const result = service.deleteUser(id);
        if (result.isErr()) {
            return match(result.error)
                .with({ type: "USER_NOT_FOUND" }, ({ id: uid }) =>
                    c.json({ message: `User ${uid} not found` }, 404))
                .with({ type: "USER_DATABASE_ERROR" }, () =>
                    c.json({ message: "Internal server error" }, 500))
                .exhaustive();
        }

        return c.body(null, 204);
    });

    return router;
}
