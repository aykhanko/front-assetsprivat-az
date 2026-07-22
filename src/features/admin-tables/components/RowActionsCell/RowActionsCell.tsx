"use client";

import { useState } from "react";
import { ConfirmDialog } from "../ConfirmDialog";
import { CreateSubTableDialog } from "../CreateSubTableDialog";
import type { AdminColumn, AdminRow, ChildTableSummary } from "../../types";
import styles from "./RowActionsCell.module.css";

export interface RowActionsCellProps {
  row: AdminRow;
  columns: AdminColumn[];
  existingByColumn: Record<string, ChildTableSummary[]>;
  path: string[];
  isPending?: boolean;
  onCreateSubTable: (columnId: string, title: string) => void;
  onDeleteSubTable: (columnId: string, childTableId: string) => void;
  onDeleteRow: () => void;
}

/**
 * Hər sətrin sonunda görünən sistem əməliyyatları: sətrin datalarından
 * birinə əsasən yeni alt cədvəl yaratmaq və sətri silmək. Bu, hər hansı
 * xüsusi sütuna deyil, birbaşa sətrə bağlıdır (Generic Dynamic Table).
 * Mövcud alt cədvəllərə keçid linkləri isə aid olduqları hüceyrənin
 * özündə (dəyərin üzərində hiperlink kimi) göstərilir — bax `AdminTableView`.
 */
export function RowActionsCell({
  row,
  columns,
  existingByColumn,
  path,
  isPending = false,
  onCreateSubTable,
  onDeleteSubTable,
  onDeleteRow,
}: RowActionsCellProps) {
  const [isCreatingSubTable, setIsCreatingSubTable] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <div className={styles.container}>
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

      <CreateSubTableDialog
        isOpen={isCreatingSubTable}
        isPending={isPending}
        row={row}
        columns={columns}
        existingByColumn={existingByColumn}
        path={path}
        onSubmit={(columnId, title) => {
          onCreateSubTable(columnId, title);
          setIsCreatingSubTable(false);
        }}
        onDeleteExisting={onDeleteSubTable}
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
