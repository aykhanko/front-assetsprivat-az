import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { getCurrentUser } from "@/features/auth/services/session.service";
import { getSiteConfig } from "@/config/site";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Sistemə giriş",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const site = getSiteConfig();

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <section className={styles.card}>
          <div className={styles.brandPanel}>
            <div className={styles.brandContent}>
              <Image
                src={site.logo.src}
                alt={site.logo.alt}
                width={site.logo.width}
                height={site.logo.height}
                className={styles.logo}
                priority
              />
              <p className={styles.departmentName}>{site.departmentName}</p>
            </div>
            <p className={styles.brandFooter}>
              Azərbaycan Respublikası Dövlət Əmlak Məsələləri üzrə Dövlət
              Xidməti
            </p>
          </div>

          <div className={styles.formPanel}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Sistemə giriş</h1>
              <p className={styles.subtitle}>
                Davam etmək üçün istifadəçi məlumatlarınızı daxil edin
              </p>
            </div>

            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
