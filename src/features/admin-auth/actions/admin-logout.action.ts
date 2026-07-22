"use server";

import { redirect } from "next/navigation";
import { destroyAdminSession } from "../services/admin-session.service";

export async function adminLogoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}
