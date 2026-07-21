import type { Metadata } from "next";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { ModuleGrid } from "@/features/dashboard/components/ModuleGrid";
import { getDashboardModules } from "@/features/dashboard/services/dashboard.service";

export const metadata: Metadata = {
  title: "Ana səhifə",
};

export default async function DashboardPage() {
  const modules = await getDashboardModules();

  return (
    <>
      <PageHeader
        subtitle="Lokal portal"
        title="Özəlləşdirilən dövlət əmlaklarının statusu haqqında"
      />
      <ModuleGrid modules={modules} />
    </>
  );
}
