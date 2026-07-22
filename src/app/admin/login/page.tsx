import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/admin-auth/components/AdminLoginForm";
import { getCurrentAdmin } from "@/features/admin-auth/services/admin-session.service";
import styles from "./admin-login.module.css";

export const metadata: Metadata = {
  title: "Admin Panel — Giriş",
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.subtitle}>
            Davam etmək üçün admin məlumatlarınızı daxil edin
          </p>
        </div>
        <AdminLoginForm />
      </section>
    </main>
  );
}
