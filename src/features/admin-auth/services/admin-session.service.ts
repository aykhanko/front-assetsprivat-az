import "server-only";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/features/admin-tables/constants";
import type { AdminSession } from "../types";

/**
 * Admin Panel sessiya idarəetməsi.
 *
 * İstifadəçi sessiyasından (`features/auth`) tamamilə ayrıdır — fərqli
 * cookie adı ilə saxlanılır ki, adi istifadəçi və admin girişləri
 * bir-birinə təsir etməsin.
 */
export async function createAdminSession(session: AdminSession): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}
