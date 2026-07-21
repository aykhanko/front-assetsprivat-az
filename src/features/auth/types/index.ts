export interface AuthenticatedUser {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: AuthenticatedUser;
}
