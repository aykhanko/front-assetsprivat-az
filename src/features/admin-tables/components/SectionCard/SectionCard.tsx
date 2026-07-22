import Link from "next/link";
import styles from "./SectionCard.module.css";

export interface SectionCardProps {
  href: string;
  title: string;
  description: string;
}

export function SectionCard({ href, title, description }: SectionCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>
    </Link>
  );
}
