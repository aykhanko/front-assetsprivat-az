import "server-only";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env/server";
import type { AuthenticatedUser } from "../types";

/**
 * Sessiya idarəetməsi.
 *
 * Hazırkı mərhələdə sessiya sadə şəkildə imzalanmamış JSON cookie kimi
 * saxlanılır. Bu, YALNIZ mock/inkişaf mərhələsi üçün kifayətdir.
 * Backend inteqrasiyası (`APP_DATA=api`) zamanı bu qat imzalanmış
 * JWT və ya server-side sessiya store-u ilə əvəz olunmalıdır — çağıran
 * kod (`getCurrentUser`, `createSession`, `destroySession`) dəyişmədən qalacaq.
 */
export async function createSession(user: AuthenticatedUser): Promise<void> {
  const env = getServerEnv();
  const cookieStore = await cookies();

  cookieStore.set(env.AUTH_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: env.AUTH_SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const env = getServerEnv();
  const cookieStore = await cookies();
  cookieStore.delete(env.AUTH_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const env = getServerEnv();
  const cookieStore = await cookies();
  const raw = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthenticatedUser;
  } catch {
    return null;
  }
}
