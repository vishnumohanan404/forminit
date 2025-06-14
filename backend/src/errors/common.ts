import { ErrorBase } from "./base";

type ErrorName = "REQUEST_VALIDATION_ERROR" | "NOT_FOUND_ERROR";

export class RequestValidationError extends ErrorBase<ErrorName> {
  constructor(name: ErrorName, cause: any) {
    super({
      name,
      message: "Invalid Request",
      statusCode: 400, // Set the specific status code for this error
      cause,
    });
  }
}

export class NotFoundError extends ErrorBase<ErrorName> {
  constructor(name: ErrorName) {
    super({
      name,
      message: "Not found",
      statusCode: 404, // Set the specific status code for this error
    });
  }
}
