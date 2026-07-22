import type { Metadata } from "next";
import { LandPlotsTable } from "@/features/land-plots/components/LandPlotsTable";
import { MOCK_LAND_PLOTS } from "@/features/land-plots/data/mock-land-plots";
import styles from "./land-plots-page.module.css";

export const metadata: Metadata = {
  title: "Torpaq sahələri",
};

export default function LandPlotsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Torpaq sahələri</h1>
      </div>
      <LandPlotsTable landPlots={MOCK_LAND_PLOTS} />
    </div>
  );
}
