import type { Mock } from "vitest";
import type { UserRepository } from "../user.repo";
import { err, ok } from "neverthrow";
import { describe, expect, it, vi } from "vitest";
import { UserService } from "../user.service";

const now = new Date();
const fakeUser = {
    id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    name: "Alice",
    email: "alice@example.com",
    createdAt: now,
};

function mockRepo(): UserRepository {
    return {
        findAll: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        deleteById: vi.fn(),
    } as unknown as UserRepository;
}

describe("userService", () => {
    describe("listUsers", () => {
        it("returns users from repo", () => {
            const repo = mockRepo();
            (repo.findAll as Mock).mockReturnValue(ok([fakeUser]));

            const result = new UserService(repo).listUsers();

            expect(result.isOk()).toBe(true);
            expect(result._unsafeUnwrap()).toEqual([fakeUser]);
        });

        it("propagates database error", () => {
            const repo = mockRepo();
            (repo.findAll as Mock).mockReturnValue(
                err({ type: "USER_DATABASE_ERROR", cause: new Error("DB down") }),
            );

            const result = new UserService(repo).listUsers();

            expect(result.isErr()).toBe(true);
            expect(result._unsafeUnwrapErr().type).toBe("USER_DATABASE_ERROR");
        });
    });

    describe("getUserById", () => {
        it("returns user when found", () => {
            const repo = mockRepo();
            (repo.findById as Mock).mockReturnValue(ok(fakeUser));

            const result = new UserService(repo).getUserById(fakeUser.id);

            expect(result.isOk()).toBe(true);
            expect(result._unsafeUnwrap()).toEqual(fakeUser);
        });

        it("returns USER_NOT_FOUND when missing", () => {
            const repo = mockRepo();
            (repo.findById as Mock).mockReturnValue(
                err({ type: "USER_NOT_FOUND", id: "missing-id" }),
            );

            const result = new UserService(repo).getUserById("missing-id");

            expect(result.isErr()).toBe(true);
            expect(result._unsafeUnwrapErr()).toMatchObject({ type: "USER_NOT_FOUND" });
        });
    });

    describe("createUser", () => {
        it("creates and returns new user", () => {
            const repo = mockRepo();
            (repo.create as Mock).mockReturnValue(ok(fakeUser));

            const result = new UserService(repo).createUser({
                name: "Alice",
                email: "alice@example.com",
            });

            expect(result.isOk()).toBe(true);
            expect(result._unsafeUnwrap()).toEqual(fakeUser);
        });

        it("returns USER_DUPLICATE_EMAIL on conflict", () => {
            const repo = mockRepo();
            (repo.create as Mock).mockReturnValue(
                err({ type: "USER_DUPLICATE_EMAIL", email: "alice@example.com" }),
            );

            const result = new UserService(repo).createUser({
                name: "Alice",
                email: "alice@example.com",
            });

            expect(result.isErr()).toBe(true);
            expect(result._unsafeUnwrapErr()).toMatchObject({ type: "USER_DUPLICATE_EMAIL" });
        });
    });
});
