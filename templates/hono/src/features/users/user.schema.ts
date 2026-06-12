import { z } from "@hono/zod-openapi";

export const UserIdParamSchema = z.object({
    id: z
        .string()
        .uuid()
        .openapi({ description: "User ID (UUID)", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }),
});

export const CreateUserBodySchema = z.object({
    name: z
        .string()
        .min(1)
        .max(100)
        .openapi({ description: "Display name", example: "Alice" }),
    email: z
        .string()
        .email()
        .openapi({ description: "Email address", example: "alice@example.com" }),
});

export const UpdateUserBodySchema = z.object({
    name: z
        .string()
        .min(1)
        .max(100)
        .optional()
        .openapi({ description: "Display name" }),
    email: z
        .string()
        .email()
        .optional()
        .openapi({ description: "Email address" }),
});

export const UserResponseSchema = z.object({
    id: z
        .string()
        .uuid()
        .openapi({ example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }),
    name: z.string().openapi({ example: "Alice" }),
    email: z.string().openapi({ example: "alice@example.com" }),
    createdAt: z
        .string()
        .datetime()
        .openapi({ example: "2024-01-01T00:00:00.000Z" }),
});

export const ErrorResponseSchema = z.object({
    message: z.string().openapi({ example: "User not found" }),
});

export type CreateUserBody = z.infer<typeof CreateUserBodySchema>;
export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;
