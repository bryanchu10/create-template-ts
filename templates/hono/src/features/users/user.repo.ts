import type { Result } from "neverthrow";
import type {
    UserDatabaseError,
    UserDuplicateEmailError,
    UserNotFoundError,
} from "./user.errors";
import type { DB } from "@/db";
import { eq } from "drizzle-orm";
import { err, ok } from "neverthrow";
import { users } from "@/db";

export type UserRow = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

function isSQLiteUniqueViolation(error: unknown): boolean {
    return error instanceof Error && error.message.includes("UNIQUE constraint failed");
}

export class UserRepository {
    constructor(private readonly db: DB) {}

    findAll(): Result<UserRow[], UserDatabaseError> {
        try {
            return ok(this.db.select().from(users).all());
        }
        catch (cause) {
            return err({ type: "USER_DATABASE_ERROR", cause });
        }
    }

    findById(id: string): Result<UserRow, UserNotFoundError | UserDatabaseError> {
        try {
            const user = this.db.select().from(users).where(eq(users.id, id)).get();
            if (!user)
                return err({ type: "USER_NOT_FOUND", id });

            return ok(user);
        }
        catch (cause) {
            return err({ type: "USER_DATABASE_ERROR", cause });
        }
    }

    create(data: NewUser): Result<UserRow, UserDuplicateEmailError | UserDatabaseError> {
        try {
            const rows = this.db.insert(users).values(data).returning().all();
            const user = rows[0];
            if (!user)
                return err({ type: "USER_DATABASE_ERROR", cause: new Error("Insert returned no rows") });

            return ok(user);
        }
        catch (cause) {
            if (isSQLiteUniqueViolation(cause)) {
                return err({ type: "USER_DUPLICATE_EMAIL", email: data.email });
            }

            return err({ type: "USER_DATABASE_ERROR", cause });
        }
    }

    update(
        id: string,
        data: Partial<Omit<NewUser, "id">>,
    ): Result<UserRow, UserNotFoundError | UserDuplicateEmailError | UserDatabaseError> {
        try {
            const rows = this.db.update(users).set(data).where(eq(users.id, id)).returning().all();
            const user = rows[0];
            if (!user)
                return err({ type: "USER_NOT_FOUND", id });

            return ok(user);
        }
        catch (cause) {
            if (isSQLiteUniqueViolation(cause)) {
                return err({ type: "USER_DUPLICATE_EMAIL", email: String(data.email ?? "") });
            }

            return err({ type: "USER_DATABASE_ERROR", cause });
        }
    }

    deleteById(id: string): Result<void, UserNotFoundError | UserDatabaseError> {
        try {
            const rows = this.db.delete(users).where(eq(users.id, id)).returning().all();
            if (!rows[0])
                return err({ type: "USER_NOT_FOUND", id });

            return ok(undefined);
        }
        catch (cause) {
            return err({ type: "USER_DATABASE_ERROR", cause });
        }
    }
}
