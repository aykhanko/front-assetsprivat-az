"use client";

import { useCallback, useState, useTransition } from "react";
import {
  addColumnAction,
  addRowAction,
  createSubTableAction,
  deleteColumnAction,
  deleteRowAction,
  renameColumnAction,
  renameTableAction,
  updateCellAction,
} from "../actions/admin-table.actions";
import type { AdminColumnType, AdminTable, ChildTableSummary } from "../types";

export interface UseAdminTableMutationsOptions {
  initialTable: AdminTable;
  initialChildTablesByRowId: Record<string, ChildTableSummary[]>;
}

/**
 * `AdminTableView` üçün bütün mutasiya çağırışlarını (Server Actions)
 * `useTransition` ilə örtür və nəticəni lokal state-ə tətbiq edir. Bu
 * sayədə UI hər dəyişiklikdən sonra tam səhifə yenilənməsi gözləmədən
 * yenilənir.
 */
export function useAdminTableMutations({
  initialTable,
  initialChildTablesByRowId,
}: UseAdminTableMutationsOptions) {
  const [table, setTable] = useState(initialTable);
  const [childTablesByRowId, setChildTablesByRowId] = useState(
    initialChildTablesByRowId
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const clearError = useCallback(() => setErrorMessage(null), []);

  const addColumn = useCallback(
    (label: string, type: AdminColumnType) => {
      startTransition(async () => {
        const result = await addColumnAction({ tableId: table.id, label, type });
        if (result.success && result.table) {
          setTable(result.table);
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? "Sütun əlavə edilə bilmədi.");
        }
      });
    },
    [table.id]
  );

  const renameColumn = useCallback(
    (columnId: string, label: string) => {
      startTransition(async () => {
        const result = await renameColumnAction({
          tableId: table.id,
          columnId,
          label,
        });
        if (result.success && result.table) {
          setTable(result.table);
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? "Sütun adı dəyişdirilə bilmədi.");
        }
      });
    },
    [table.id]
  );

  const deleteColumn = useCallback(
    (columnId: string) => {
      startTransition(async () => {
        const result = await deleteColumnAction({ tableId: table.id, columnId });
        if (result.success && result.table) {
          setTable(result.table);
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? "Sütun silinə bilmədi.");
        }
      });
    },
    [table.id]
  );

  const addRow = useCallback(() => {
    startTransition(async () => {
      const result = await addRowAction({ tableId: table.id });
      if (result.success && result.table) {
        setTable(result.table);
        setErrorMessage(null);
      } else {
        setErrorMessage(result.message ?? "Sətir əlavə edilə bilmədi.");
      }
    });
  }, [table.id]);

  const updateCell = useCallback(
    (rowId: string, columnId: string, value: string) => {
      startTransition(async () => {
        const result = await updateCellAction({
          tableId: table.id,
          rowId,
          columnId,
          value,
        });
        if (result.success && result.table) {
          setTable(result.table);
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? "Dəyər yadda saxlanıla bilmədi.");
        }
      });
    },
    [table.id]
  );

  const deleteRow = useCallback(
    (rowId: string) => {
      startTransition(async () => {
        const result = await deleteRowAction({ tableId: table.id, rowId });
        if (result.success && result.table) {
          setTable(result.table);
          setChildTablesByRowId((prev) => {
            const next = { ...prev };
            delete next[rowId];
            return next;
          });
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? "Sətir silinə bilmədi.");
        }
      });
    },
    [table.id]
  );

  const renameTable = useCallback(
    (title: string) => {
      startTransition(async () => {
        const result = await renameTableAction({ tableId: table.id, title });
        if (result.success && result.table) {
          setTable(result.table);
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? "Cədvəl adı dəyişdirilə bilmədi.");
        }
      });
    },
    [table.id]
  );

  const createSubTable = useCallback(
    (rowId: string, title: string, onCreated?: (childTable: AdminTable) => void) => {
      startTransition(async () => {
        const result = await createSubTableAction({
          tableId: table.id,
          rowId,
          title,
        });
        if (result.success && result.childTable) {
          setChildTablesByRowId((prev) => ({
            ...prev,
            [rowId]: [...(prev[rowId] ?? []), result.childTable!],
          }));
          setErrorMessage(null);
          onCreated?.(result.childTable);
        } else {
          setErrorMessage(result.message ?? "Alt cədvəl yaradıla bilmədi.");
        }
      });
    },
    [table.id]
  );

  return {
    table,
    childTablesByRowId,
    errorMessage,
    isPending,
    clearError,
    addColumn,
    renameColumn,
    deleteColumn,
    addRow,
    updateCell,
    deleteRow,
    renameTable,
    createSubTable,
  };
}
