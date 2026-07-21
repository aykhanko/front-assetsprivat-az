import { redirect } from "next/navigation";
import { AppTopBar } from "@/components/layout";
import { getCurrentUser } from "@/features/auth/services/session.service";
import styles from "./app-layout.module.css";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className={styles.shell}>
      <AppTopBar user={user} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
