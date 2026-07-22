"use client";

import Link from "next/link";
import { Modal } from "@/components/ui";
import type {
  AdminTable,
  ChildTablesByCell,
  DescendantSubTableSummary,
} from "../../types";
import styles from "./AllSubTablesDialog.module.css";

export type SubTablesDialogMode = "direct" | "all";

export interface AllSubTablesDialogProps {
  isOpen: boolean;
  mode: SubTablesDialogMode;
  table: AdminTable;
  path: string[];
  /** Yalnız cari cədvəlin birbaşa alt cədvəlləri. */
  childTablesByCell: ChildTablesByCell;
  /** Cari cədvəldən bütün dərinlikdəki alt cədvəllər (nəvələr daxil). */
  descendantSubTables: DescendantSubTableSummary[];
  onClose: () => void;
}

interface SubTableEntry {
  key: string;
  depth: number;
  parentTableTitle?: string;
  rowNumber: number;
  columnLabel: string;
  cellValue: string;
  childTitle: string;
  href: string;
}

function buildDirectEntries(
  table: AdminTable,
  path: string[],
  childTablesByCell: ChildTablesByCell
): SubTableEntry[] {
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
          depth: 1,
          rowNumber: rowIndex + 1,
          columnLabel: column.label,
          cellValue: row.values[column.key] ?? "",
          childTitle: child.title,
          href: `/admin/${[...path, child.slug].join("/")}`,
        });
      });
    });
  });

  return entries;
}

function buildAllEntries(
  path: string[],
  descendants: DescendantSubTableSummary[]
): SubTableEntry[] {
  return descendants.map((item) => ({
    key: item.id,
    depth: item.depth,
    parentTableTitle: item.parentTableTitle,
    rowNumber: item.rowNumber,
    columnLabel: item.columnLabel,
    cellValue: item.cellValue,
    childTitle: item.title,
    href: `/admin/${[...path, ...item.relativePath].join("/")}`,
  }));
}

/**
 * Alt cədvəl siyahısı dialoqu.
 *
 * - `direct`: yalnız bu cədvəlin birbaşa alt cədvəlləri
 * - `all`: bu cədvəldən başlayan bütün dərinlikdəki alt cədvəllər
 */
export function AllSubTablesDialog({
  isOpen,
  mode,
  table,
  path,
  childTablesByCell,
  descendantSubTables,
  onClose,
}: AllSubTablesDialogProps) {
  const entries =
    mode === "all"
      ? buildAllEntries(path, descendantSubTables)
      : buildDirectEntries(table, path, childTablesByCell);

  const title = mode === "all" ? "Bütün alt cədvəllər" : "Alt cədvəllər";
  const emptyMessage =
    mode === "all"
      ? "Bu cədvəldə və onun alt cədvəllərində hələ heç bir alt cədvəl yoxdur."
      : "Bu cədvəldə hələ heç bir alt cədvəl yaradılmayıb.";

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      {entries.length === 0 ? (
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      ) : (
        <div className={styles.list}>
          {entries.map((entry) => (
            <div
              key={entry.key}
              className={styles.entry}
              style={{ marginLeft: `${(entry.depth - 1) * 12}px` }}
            >
              <div className={styles.entryInfo}>
                {mode === "all" && entry.parentTableTitle ? (
                  <span className={styles.entryParent}>
                    {entry.parentTableTitle}
                  </span>
                ) : null}
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
              <Link
                href={entry.href}
                className={styles.goButton}
                onClick={onClose}
              >
                Keç
              </Link>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
