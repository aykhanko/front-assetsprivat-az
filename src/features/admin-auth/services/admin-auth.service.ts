import { verifyMockAdminCredentials } from "../data/mock-admin-credentials";
import type { AdminLoginFormValues } from "../schemas/admin-login.schema";
import type { AdminLoginResult } from "../types";

/**
 * Admin Panel autentifikasiya servisi.
 *
 * Hazırda YALNIZ mock məlumatlarla işləyir. Gələcək real API inteqrasiyası
 * üçün bax: `docs/admin-panel-api.md` (POST /api/admin/auth/login).
 */
export async function loginAsAdmin(
  values: AdminLoginFormValues
): Promise<AdminLoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!verifyMockAdminCredentials(values.username, values.password)) {
    return {
      success: false,
      message: "İstifadəçi adı və ya parol yanlışdır.",
    };
  }

  return { success: true, session: { username: values.username } };
}
