export interface AdminSession {
  username: string;
}

export interface AdminLoginResult {
  success: boolean;
  message?: string;
  session?: AdminSession;
}
