import { redirect } from "next/navigation";
import { AdminTopBar } from "@/features/admin-auth/components/AdminTopBar";
import { getCurrentAdmin } from "@/features/admin-auth/services/admin-session.service";
import styles from "./admin-protected-layout.module.css";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.shell}>
      <AdminTopBar admin={admin} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
