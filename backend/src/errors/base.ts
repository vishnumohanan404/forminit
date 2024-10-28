export class ErrorBase<T extends string> extends Error {
  name: T;
  message: string;
  cause: any;
  statusCode: number;
  constructor({
    name,
    message,
    cause,
    statusCode = 500,
  }: {
    name: T;
    message: string;
    cause?: any;
    statusCode?: number;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
    this.statusCode = statusCode;
  }
}
