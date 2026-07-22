import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminTableView } from "@/features/admin-tables/components/AdminTableView";
import {
  getChildTablesByRow,
  resolveTableByPath,
} from "@/features/admin-tables/services/admin-table.service";

export interface AdminTablePageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: AdminTablePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveTableByPath(slug);
  return { title: resolved ? resolved.table.title : "Cədvəl tapılmadı" };
}

/**
 * Generic Dynamic Table marşrutu — istənilən dərinlikdə (root cədvəldən
 * sonsuz sayda alt cədvələ qədər) slug zənciri bu tək route tərəfindən
 * həll olunur.
 */
export default async function AdminTablePage({ params }: AdminTablePageProps) {
  const { slug } = await params;
  const resolved = await resolveTableByPath(slug);

  if (!resolved) {
    notFound();
  }

  const childTablesByRowId = await getChildTablesByRow(resolved.table.id);

  return (
    <AdminTableView
      initialTable={resolved.table}
      breadcrumbs={resolved.breadcrumbs}
      path={resolved.path}
      initialChildTablesByRowId={childTablesByRowId}
    />
  );
}
