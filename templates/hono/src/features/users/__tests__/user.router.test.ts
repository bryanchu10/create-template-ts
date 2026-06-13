import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "@/app";
import { schema } from "@/db";

function setupTestDb() {
    const sqlite = new Database(":memory:");
    sqlite.pragma("foreign_keys = ON");
    sqlite.exec(`
    CREATE TABLE users (
      id         TEXT    PRIMARY KEY NOT NULL,
      name       TEXT    NOT NULL,
      email      TEXT    NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    )
  `);
    sqlite.exec(`
    CREATE TABLE posts (
      id         TEXT    PRIMARY KEY NOT NULL,
      title      TEXT    NOT NULL,
      content    TEXT    NOT NULL,
      user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL
    )
  `);

    return drizzle(sqlite, { schema });
}

describe("user API", () => {
    let app: ReturnType<typeof createApp>;

    beforeEach(() => {
        app = createApp(setupTestDb());
    });

    describe("gET /api/users", () => {
        it("returns empty array initially", async () => {
            const res = await app.request("/api/users");
            expect(res.status).toBe(200);
            expect(await res.json()).toEqual([]);
        });
    });

    describe("pOST /api/users", () => {
        it("creates a user and returns 201", async () => {
            const res = await app.request("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Alice", email: "alice@example.com" }),
            });
            expect(res.status).toBe(201);
            const body = await res.json() as { id: string; name: string; email: string };
            expect(body.name).toBe("Alice");
            expect(body.email).toBe("alice@example.com");
            expect(body.id).toBeTypeOf("string");
        });

        it("returns 422 for missing email", async () => {
            const res = await app.request("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Alice" }),
            });
            expect(res.status).toBe(422);
        });

        it("returns 409 for duplicate email", async () => {
            const payload = JSON.stringify({ name: "Alice", email: "alice@example.com" });
            await app.request("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });
            const res = await app.request("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });
            expect(res.status).toBe(409);
        });
    });

    describe("gET /api/users/:id", () => {
        it("returns 404 for unknown id", async () => {
            const res = await app.request(
                "/api/users/00000000-0000-0000-0000-000000000000",
            );
            expect(res.status).toBe(404);
        });

        it("returns the user by id", async () => {
            const createRes = await app.request("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Bob", email: "bob@example.com" }),
            });
            const { id } = await createRes.json() as { id: string };

            const res = await app.request(`/api/users/${id}`);
            expect(res.status).toBe(200);
            const body = await res.json() as { name: string };
            expect(body.name).toBe("Bob");
        });
    });

    describe("pATCH /api/users/:id", () => {
        it("updates a user name", async () => {
            const createRes = await app.request("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Carol", email: "carol@example.com" }),
            });
            const { id } = await createRes.json() as { id: string };

            const res = await app.request(`/api/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Carol Updated" }),
            });
            expect(res.status).toBe(200);
            const body = await res.json() as { name: string };
            expect(body.name).toBe("Carol Updated");
        });

        it("returns 404 for unknown id", async () => {
            const res = await app.request(
                "/api/users/00000000-0000-0000-0000-000000000000",
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: "Nobody" }),
                },
            );
            expect(res.status).toBe(404);
        });
    });

    describe("dELETE /api/users/:id", () => {
        it("deletes a user and returns 204", async () => {
            const createRes = await app.request("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Dave", email: "dave@example.com" }),
            });
            const { id } = await createRes.json() as { id: string };

            const deleteRes = await app.request(`/api/users/${id}`, {
                method: "DELETE",
            });
            expect(deleteRes.status).toBe(204);

            const getRes = await app.request(`/api/users/${id}`);
            expect(getRes.status).toBe(404);
        });

        it("returns 404 for unknown id", async () => {
            const res = await app.request(
                "/api/users/00000000-0000-0000-0000-000000000000",
                { method: "DELETE" },
            );
            expect(res.status).toBe(404);
        });
    });
});
