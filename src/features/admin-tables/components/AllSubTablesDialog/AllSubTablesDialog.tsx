"use client";

import Link from "next/link";
import { Modal } from "@/components/ui";
import type { AdminTable, ChildTablesByCell } from "../../types";
import styles from "./AllSubTablesDialog.module.css";

export interface AllSubTablesDialogProps {
  isOpen: boolean;
  table: AdminTable;
  path: string[];
  childTablesByCell: ChildTablesByCell;
  onClose: () => void;
}

interface SubTableEntry {
  key: string;
  rowNumber: number;
  columnLabel: string;
  cellValue: string;
  childTitle: string;
  href: string;
}

/**
 * Cari cədvəldəki (istənilən sətir/hüceyrə üzrə) BÜTÜN alt cədvəlləri tək
 * yerdə göstərir — hansı box-un (sətir + sütun) hansı alt cədvələ bağlı
 * olduğunu aydın edir və birbaşa həmin cədvələ keçidi təmin edir.
 */
export function AllSubTablesDialog({
  isOpen,
  table,
  path,
  childTablesByCell,
  onClose,
}: AllSubTablesDialogProps) {
  const entries: SubTableEntry[] = [];

  table.rows.forEach((row, rowIndex) => {
    const byColumn = childTablesByCell[row.id];
    if (!byColumn) return;

    table.columns.forEach((column) => {
      const children = byColumn[column.id];
      if (!children || children.length === 0) return;

      children.forEach((child) => {
        entries.push({
          key: child.id,
          rowNumber: rowIndex + 1,
          columnLabel: column.label,
          cellValue: row.values[column.key] ?? "",
          childTitle: child.title,
          href: `/admin/${[...path, child.slug].join("/")}`,
        });
      });
    });
  });

  return (
    <Modal isOpen={isOpen} title="Bütün alt cədvəllər" onClose={onClose}>
      {entries.length === 0 ? (
        <p className={styles.emptyMessage}>
          Bu cədvəldə hələ heç bir alt cədvəl yaradılmayıb.
        </p>
      ) : (
        <div className={styles.list}>
          {entries.map((entry) => (
            <div key={entry.key} className={styles.entry}>
              <div className={styles.entryInfo}>
                <span className={styles.entryBadge}>#{entry.rowNumber}</span>
                <span className={styles.entryColumn}>{entry.columnLabel}</span>
                <span className={styles.entryValue}>
                  {entry.cellValue || <em>(boş)</em>}
                </span>
                <span className={styles.entryArrow} aria-hidden="true">
                  →
                </span>
                <span className={styles.entryTitle}>{entry.childTitle}</span>
              </div>
              <Link href={entry.href} className={styles.goButton} onClick={onClose}>
                Keç
              </Link>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
