import type { DB } from "@/db";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar as scalar } from "@scalar/hono-api-reference";
import { env } from "@/config";
import { db } from "@/db";
import { createUserRouter, UserRepository, UserService } from "@/features/users";
import { errorHandler } from "@/middleware";

export function createApp(dbOverride?: DB) {
    const app = new OpenAPIHono({
        defaultHook(result, c) {
            if (!result.success) {
                const message = result.error.issues
                    .map((i) => i.message)
                    .join(", ");

                return c.json({ message }, 422);
            }
        },
    });

    const database = dbOverride ?? db;
    const userRepo = new UserRepository(database);
    const userService = new UserService(userRepo);

    app.route("/api/users", createUserRouter(userService));

    app.doc31("/api/openapi.json", {
        openapi: "3.1.0",
        info: {
            title: "Hono API Demo",
            version: "1.0.0",
            description: "A layered Hono API server with OpenAPI documentation",
        },
    });

    if (env.NODE_ENV !== "production") {
        app.get(
            "/docs",
            scalar({
                url: "/api/openapi.json",
                pageTitle: "Hono API Docs",
                showDeveloperTools: "never",
                mcp: { disabled: true },
                agent: {
                    disabled: true,
                },
                hideClientButton: true,
                telemetry: false,
            }),
        );
    }

    app.onError(errorHandler);

    return app;
}
