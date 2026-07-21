import { findMockUserByCredentials } from "../../data/mock-users";
import type { LoginFormValues } from "../../schemas/login.schema";
import type { LoginResult } from "../../types";

/**
 * Mock autentifikasiya provayderi. `APP_DATA=mock` olduqda istifadə olunur.
 */
export async function loginWithMockProvider(
  values: LoginFormValues
): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const record = findMockUserByCredentials(values.username, values.password);

  if (!record) {
    return {
      success: false,
      message: "İstifadəçi adı və ya parol yanlışdır.",
    };
  }

  return {
    success: true,
    user: {
      id: record.id,
      username: record.username,
      fullName: record.fullName,
      role: record.role,
    },
  };
}
