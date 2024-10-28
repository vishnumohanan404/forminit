export interface User {
  id: number;
  email: string;
  username: string;
}

export interface CreateUserQueryParams {
  loginAfterCreate?: boolean;
}
