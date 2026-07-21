import styles from "./PageHeader.module.css";

export interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <p className={styles.subtitle}>{subtitle}</p>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
}
