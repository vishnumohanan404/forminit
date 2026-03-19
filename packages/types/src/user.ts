export interface User {
  _id: string;
  fullName: string;
  email: string;
  bio?: string;
  avatar?: string;
  googleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
