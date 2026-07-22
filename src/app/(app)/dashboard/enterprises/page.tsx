import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicTableView } from "@/features/admin-tables/components/PublicTableView";
import { DASHBOARD_ROOT_SLUG_TO_ADMIN_SLUG } from "@/features/admin-tables/constants";
import {
  getChildTablesByCell,
  resolveTableByPath,
} from "@/features/admin-tables/services/admin-table.service";
import styles from "./enterprises-page.module.css";

export const metadata: Metadata = {
  title: "Müəssisələr",
};

export default async function EnterprisesPage() {
  const dashboardPath = ["enterprises"];
  const adminSlug = DASHBOARD_ROOT_SLUG_TO_ADMIN_SLUG[dashboardPath[0]];
  const resolved = await resolveTableByPath([adminSlug]);

  if (!resolved) {
    notFound();
  }

  const childTablesByCell = await getChildTablesByCell(resolved.table.id);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{resolved.table.title}</h1>
      </div>
      <PublicTableView
        table={resolved.table}
        dashboardPath={dashboardPath}
        childTablesByCell={childTablesByCell}
      />
    </div>
  );
}
