import Link from "next/link";
import type { DashboardModule } from "../../types";
import styles from "./ModuleCard.module.css";
import { ModuleIcon } from "./ModuleIcon";

export interface ModuleCardProps {
  module: DashboardModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const content = (
    <>
      <span className={styles.iconWrapper} aria-hidden="true">
        <ModuleIcon name={module.icon} />
      </span>
      <span className={styles.title}>{module.title}</span>
      <span className={styles.description}>{module.description}</span>
    </>
  );

  if (module.isEnabled) {
    return (
      <Link href={module.href} className={styles.card}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={styles.card} aria-disabled="true">
      {content}
    </button>
  );
}
