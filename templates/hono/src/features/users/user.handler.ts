import type { UserRow } from "./user.repo";

export function toUserResponse(user: UserRow) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
    };
}
