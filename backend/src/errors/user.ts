import { ErrorBase } from "./base";

type ErrorName = "USER_ALREADY_EXISTS" | "USER_NOT_AUTHORIZED" | "USER_NOT_FOUND";

export class UserNotFoundError extends ErrorBase<ErrorName> {
  constructor(name: ErrorName) {
    super({
      name,
      message: "User not found",
      statusCode: 404, // Set the specific status code for this error
    });
  }
}
export class ConflictError extends ErrorBase<ErrorName> {
  constructor(name: ErrorName) {
    super({
      name,
      message: "User already exists with this email.",
      statusCode: 409, // Set the specific status code for this error
    });
  }
}
export class UnauthorizedError extends ErrorBase<ErrorName> {
  constructor(name: ErrorName) {
    super({
      name,
      message: "Unauthorized",
      statusCode: 401, // Set the specific status code for this error
    });
  }
}


