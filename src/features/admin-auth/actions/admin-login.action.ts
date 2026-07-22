"use server";

import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "../schemas/admin-login.schema";
import { loginAsAdmin } from "../services/admin-auth.service";
import { createAdminSession } from "../services/admin-session.service";
import type { AdminLoginResult } from "../types";

export async function adminLoginAction(
  values: AdminLoginFormValues
): Promise<AdminLoginResult> {
  const parsed = adminLoginSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Daxil edilən məlumatlar düzgün deyil." };
  }

  const result = await loginAsAdmin(parsed.data);

  if (result.success && result.session) {
    await createAdminSession(result.session);
  }

  return result;
}
