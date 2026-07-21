"use server";

import { redirect } from "next/navigation";
import { destroySession } from "../services/session.service";

/**
 * Server Action — istifadəçi sessiyasını sonlandırır və giriş səhifəsinə
 * yönləndirir.
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
