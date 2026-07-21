"use server";

import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { login } from "../services/auth.service";
import { createSession } from "../services/session.service";
import type { LoginResult } from "../types";

/**
 * Server Action — giriş forması bu action üzərindən server tərəfə müraciət
 * edir. Bu sayədə `AUTH_SECRET`, `APP_DATA`, mock istifadəçi siyahısı və
 * digər həssas server-only məlumatlar heç vaxt client bundle-a düşmür.
 */
export async function loginAction(
  values: LoginFormValues
): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Daxil edilən məlumatlar düzgün deyil.",
    };
  }

  const result = await login(parsed.data);

  if (result.success && result.user) {
    await createSession(result.user);
  }

  return result;
}
