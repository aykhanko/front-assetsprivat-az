import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicTableView } from "@/features/admin-tables/components/PublicTableView";
import { DASHBOARD_ROOT_SLUG_TO_ADMIN_SLUG } from "@/features/admin-tables/constants";
import {
  getChildTablesByCell,
  resolveTableByPath,
} from "@/features/admin-tables/services/admin-table.service";
import styles from "./dashboard-table.module.css";

export interface DashboardTablePageProps {
  params: Promise<{ slug: string[] }>;
}

async function resolveDashboardTable(slug: string[]) {
  const [rootSegment, ...rest] = slug;
  const adminRootSlug = DASHBOARD_ROOT_SLUG_TO_ADMIN_SLUG[rootSegment];

  if (!adminRootSlug) {
    return null;
  }

  return resolveTableByPath([adminRootSlug, ...rest]);
}

export async function generateMetadata({
  params,
}: DashboardTablePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveDashboardTable(slug);
  return { title: resolved ? resolved.table.title : "Cədvəl tapılmadı" };
}

/**
 * `/dashboard` tərəfində istənilən dərinlikdə (root cədvəldən sonra
 * yaradılmış istənilən sayda alt cədvələ qədər) admin tərəfindən
 * yaradılmış alt cədvəlləri READ-ONLY göstərir. Bu route yalnız statik
 * root səhifələrin (`enterprises`, `property-complexes`, `land-plots`)
 * əhatə etmədiyi daha dərin yollar üçün işə düşür.
 */
export default async function DashboardTablePage({
  params,
}: DashboardTablePageProps) {
  const { slug } = await params;
  const resolved = await resolveDashboardTable(slug);

  if (!resolved) {
    notFound();
  }

  const childTablesByCell = await getChildTablesByCell(resolved.table.id);

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/dashboard" className={styles.breadcrumbLink}>
          İdarə paneli
        </Link>
        {resolved.breadcrumbs.map((crumb, index) => {
          const href = `/dashboard/${slug.slice(0, index + 1).join("/")}`;
          const isLast = index === resolved.breadcrumbs.length - 1;
          return (
            <span key={crumb.id} className={styles.breadcrumbItem}>
              <span className={styles.breadcrumbSeparator}>/</span>
              {isLast ? (
                <span className={styles.breadcrumbCurrent}>{crumb.title}</span>
              ) : (
                <Link href={href} className={styles.breadcrumbLink}>
                  {crumb.title}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className={styles.header}>
        <h1 className={styles.title}>{resolved.table.title}</h1>
      </div>

      <PublicTableView
        table={resolved.table}
        dashboardPath={slug}
        childTablesByCell={childTablesByCell}
      />
    </div>
  );
}
