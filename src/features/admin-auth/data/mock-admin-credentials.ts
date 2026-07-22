/**
 * Admin Panel üçün mock giriş məlumatları.
 *
 * QEYD: Bu YALNIZ Mock Data mərhələsi üçündür (istifadəçi: admin / admin).
 * Real admin autentifikasiyası tətbiq olunduqda bu fayl silinməli və
 * `docs/admin-panel-api.md`-də qeyd olunan endpoint istifadə olunmalıdır.
 */
export const MOCK_ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin",
} as const;

export function verifyMockAdminCredentials(
  username: string,
  password: string
): boolean {
  return (
    username === MOCK_ADMIN_CREDENTIALS.username &&
    password === MOCK_ADMIN_CREDENTIALS.password
  );
}
