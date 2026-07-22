import type { Metadata } from "next";
import { SectionCard } from "@/features/admin-tables/components/SectionCard";
import { getRootTables } from "@/features/admin-tables/services/admin-table.service";
import { ROOT_TABLE_DEFINITIONS } from "@/features/admin-tables/constants";
import styles from "./admin-landing.module.css";

export const metadata: Metadata = {
  title: "Admin Panel",
};

export default async function AdminLandingPage() {
  const rootTables = await getRootTables();

  const sections = ROOT_TABLE_DEFINITIONS.map((definition) => {
    const table = rootTables.find((item) => item.slug === definition.slug);
    return {
      slug: definition.slug,
      title: table?.title ?? definition.title,
      description: table?.description ?? definition.description,
    };
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>İdarə etmək istədiyiniz bölməni seçin</p>
      </div>

      <div className={styles.grid}>
        {sections.map((section) => (
          <SectionCard
            key={section.slug}
            href={`/admin/${section.slug}`}
            title={section.title}
            description={section.description}
          />
        ))}
      </div>
    </div>
  );
}
