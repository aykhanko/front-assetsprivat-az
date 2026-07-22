"use client";

import { useState } from "react";
import Link from "next/link";
import { ConfirmDialog } from "../ConfirmDialog";
import { CreateSubTableDialog } from "../CreateSubTableDialog";
import type { ChildTableSummary } from "../../types";
import styles from "./RowActionsCell.module.css";

export interface RowActionsCellProps {
  path: string[];
  childTables: ChildTableSummary[];
  isPending?: boolean;
  onCreateSubTable: (title: string) => void;
  onDeleteRow: () => void;
}

/**
 * Hər sətrin sonunda görünən sistem əməliyyatları: mövcud alt cədvəllərə
 * keçid linkləri, yeni alt cədvəl yaratmaq və sətri silmək. Bu, hər hansı
 * xüsusi sütuna deyil, birbaşa sətrə bağlıdır (Generic Dynamic Table).
 */
export function RowActionsCell({
  path,
  childTables,
  isPending = false,
  onCreateSubTable,
  onDeleteRow,
}: RowActionsCellProps) {
  const [isCreatingSubTable, setIsCreatingSubTable] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <div className={styles.container}>
      {childTables.length > 0 ? (
        <ul className={styles.subTableList}>
          {childTables.map((child) => (
            <li key={child.id}>
              <Link
                href={`/admin/${[...path, child.slug].join("/")}`}
                className={styles.subTableLink}
              >
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={styles.buttonRow}>
        <button
          type="button"
          className={styles.subTableButton}
          onClick={() => setIsCreatingSubTable(true)}
        >
          + Alt cədvəl
        </button>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => setIsConfirmingDelete(true)}
        >
          Sil
        </button>
      </div>

      <CreateSubTableDialog
        isOpen={isCreatingSubTable}
        isPending={isPending}
        onSubmit={(title) => {
          onCreateSubTable(title);
          setIsCreatingSubTable(false);
        }}
        onCancel={() => setIsCreatingSubTable(false)}
      />

      <ConfirmDialog
        isOpen={isConfirmingDelete}
        title="Sətri sil"
        message="Bu sətri silmək istədiyinizə əminsiniz? Sətrə bağlı bütün alt cədvəllər də silinəcək."
        isPending={isPending}
        onConfirm={() => {
          onDeleteRow();
          setIsConfirmingDelete(false);
        }}
        onCancel={() => setIsConfirmingDelete(false)}
      />
    </div>
  );
}
