import type { DashboardModule } from "../../types";
import { ModuleCard } from "../ModuleCard";
import styles from "./ModuleGrid.module.css";

export interface ModuleGridProps {
  modules: DashboardModule[];
}

export function ModuleGrid({ modules }: ModuleGridProps) {
  return (
    <div className={styles.grid}>
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
}
