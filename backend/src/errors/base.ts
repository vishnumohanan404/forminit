import { FieldValidationError } from "express-validator";
export class ErrorBase<T extends string> extends Error {
  name: T;
  message: string;
  cause: FieldValidationError[] | unknown;
  statusCode: number;
  constructor({
    name,
    message,
    cause,
    statusCode = 500,
  }: {
    name: T;
    message: string;
    cause?: FieldValidationError[] | unknown;
    statusCode?: number;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
    this.statusCode = statusCode;
  }
}
