import type { Metadata } from "next";
import { EnterprisesTable } from "@/features/enterprises/components/EnterprisesTable";
import { MOCK_ENTERPRISES } from "@/features/enterprises/data/mock-enterprises";
import styles from "./enterprises-page.module.css";

export const metadata: Metadata = {
  title: "Müəssisələr",
};

export default function EnterprisesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Müəssisələr</h1>
      </div>
      <EnterprisesTable enterprises={MOCK_ENTERPRISES} />
    </div>
  );
}
