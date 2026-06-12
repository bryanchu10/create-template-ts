import type { Result } from "neverthrow";
import type {
    UserDatabaseError,
    UserDuplicateEmailError,
    UserNotFoundError,
} from "./user.errors";
import type { UserRepository, UserRow } from "./user.repo";
import type { CreateUserBody, UpdateUserBody } from "./user.schema";

export class UserService {
    constructor(private readonly userRepo: UserRepository) {}

    listUsers(): Result<UserRow[], UserDatabaseError> {
        return this.userRepo.findAll();
    }

    getUserById(id: string): Result<UserRow, UserNotFoundError | UserDatabaseError> {
        return this.userRepo.findById(id);
    }

    createUser(body: CreateUserBody): Result<UserRow, UserDuplicateEmailError | UserDatabaseError> {
        return this.userRepo.create(body);
    }

    updateUser(
        id: string,
        body: UpdateUserBody,
    ): Result<UserRow, UserNotFoundError | UserDuplicateEmailError | UserDatabaseError> {
        return this.userRepo.update(id, body);
    }

    deleteUser(id: string): Result<void, UserNotFoundError | UserDatabaseError> {
        return this.userRepo.deleteById(id);
    }
}
