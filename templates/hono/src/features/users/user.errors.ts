export interface UserNotFoundError {
    type: "USER_NOT_FOUND";
    id: string;
}

export interface UserDuplicateEmailError {
    type: "USER_DUPLICATE_EMAIL";
    email: string;
}

export interface UserDatabaseError {
    type: "USER_DATABASE_ERROR";
    cause: unknown;
}

export type UserError =
    | UserNotFoundError
    | UserDuplicateEmailError
    | UserDatabaseError;
