import type { DashboardModule } from "../../types";
import styles from "./ModuleCard.module.css";
import { ModuleIcon } from "./ModuleIcon";

export interface ModuleCardProps {
  module: DashboardModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <button
      type="button"
      className={styles.card}
      aria-disabled={!module.isEnabled}
    >
      <span className={styles.iconWrapper} aria-hidden="true">
        <ModuleIcon name={module.icon} />
      </span>
      <span className={styles.title}>{module.title}</span>
      <span className={styles.description}>{module.description}</span>
    </button>
  );
}
