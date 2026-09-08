export class AuthorizationError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403 | 404,
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}
