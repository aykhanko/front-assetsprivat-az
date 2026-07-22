import type { Metadata } from "next";
import { PropertyComplexesTable } from "@/features/property-complexes/components/PropertyComplexesTable";
import { MOCK_PROPERTY_COMPLEXES } from "@/features/property-complexes/data/mock-property-complexes";
import styles from "./property-complexes-page.module.css";

export const metadata: Metadata = {
  title: "Əmlak kompleksləri",
};

export default function PropertyComplexesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Əmlak kompleksləri</h1>
      </div>
      <PropertyComplexesTable complexes={MOCK_PROPERTY_COMPLEXES} />
    </div>
  );
}
