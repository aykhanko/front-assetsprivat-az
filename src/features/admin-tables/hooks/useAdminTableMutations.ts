"use client";

import { useCallback, useState, useTransition } from "react";
import {
  addColumnAction,
  addRowAction,
  createSubTableAction,
  deleteColumnAction,
  deleteRowAction,
  deleteSubTableAction,
  renameColumnAction,
  renameTableAction,
  updateCellAction,
  updateCellMetaAction,
} from "../actions/admin-table.actions";
import type { AdminTable, ChildTablesByCell } from "../types";

export type { ChildTablesByCell } from "../types";

export interface UseAdminTableMutationsOptions {
  initialTable: AdminTable;
  initialChildTablesByCell: ChildTablesByCell;
}

/**
 * `AdminTableView` üçün bütün mutasiya çağırışlarını (Server Actions)
 * `useTransition` ilə örtür və nəticəni lokal state-ə tətbiq edir. Bu
 * sayədə UI hər dəyişiklikdən sonra tam səhifə yenilənməsi gözləmədən
 * yenilənir.
 */
export function useAdminTableMutations({
  initialTable,
  initialChildTablesByCell,
}: UseAdminTableMutationsOptions) {
  const [table, setTable] = useState(initialTable);
  const [childTablesByCell, setChildTablesByCell] = useState<ChildTablesByCell>(
    initialChildTablesByCell
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const clearError = useCallback(() => setErrorMessage(null), []);

  const addColumn = useCallback(
    (label: string) => {
      startTransition(async () => {
        const result = await addColumnAction({
          tableId: table.id,
          label,
          type: "text",
        });
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
          setChildTablesByCell((prev) => {
            const next: ChildTablesByCell = {};
            for (const [rowId, byColumn] of Object.entries(prev)) {
              const nextByColumn = { ...byColumn };
              delete nextByColumn[columnId];
              next[rowId] = nextByColumn;
            }
            return next;
          });
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
          const trimmed = value.trim();
          if (trimmed) {
            setChildTablesByCell((prev) => {
              const byColumn = prev[rowId];
              if (!byColumn?.[columnId]?.length) {
                return prev;
              }
              return {
                ...prev,
                [rowId]: {
                  ...byColumn,
                  [columnId]: byColumn[columnId].map((child) => ({
                    ...child,
                    title: trimmed,
                  })),
                },
              };
            });
          }
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? "Dəyər yadda saxlanıla bilmədi.");
        }
      });
    },
    [table.id]
  );

  const updateCellMeta = useCallback(
    (
      rowId: string,
      columnId: string,
      meta: {
        externalUrl?: string;
        fileName?: string;
        clearExternalUrl?: boolean;
        clearFile?: boolean;
      }
    ) => {
      startTransition(async () => {
        const result = await updateCellMetaAction({
          tableId: table.id,
          rowId,
          columnId,
          ...meta,
        });
        if (result.success && result.table) {
          setTable(result.table);
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? "Meta məlumat yadda saxlanıla bilmədi.");
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
          setChildTablesByCell((prev) => {
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
    (
      rowId: string,
      columnId: string,
      title: string,
      onCreated?: (childTable: AdminTable) => void
    ) => {
      startTransition(async () => {
        const result = await createSubTableAction({
          tableId: table.id,
          rowId,
          columnId,
          title,
        });
        if (result.success && result.childTable) {
          setChildTablesByCell((prev) => {
            const byColumn = prev[rowId] ?? {};
            const list = byColumn[columnId] ?? [];
            return {
              ...prev,
              [rowId]: { ...byColumn, [columnId]: [...list, result.childTable!] },
            };
          });
          setErrorMessage(null);
          onCreated?.(result.childTable);
        } else {
          setErrorMessage(result.message ?? "Alt cədvəl yaradıla bilmədi.");
        }
      });
    },
    [table.id]
  );

  const deleteSubTable = useCallback(
    (rowId: string, columnId: string, childTableId: string) => {
      startTransition(async () => {
        const result = await deleteSubTableAction({
          parentTableId: table.id,
          childTableId,
        });
        if (result.success) {
          setChildTablesByCell((prev) => {
            const byColumn = prev[rowId] ?? {};
            const list = (byColumn[columnId] ?? []).filter(
              (child) => child.id !== childTableId
            );
            return { ...prev, [rowId]: { ...byColumn, [columnId]: list } };
          });
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? "Alt cədvəl silinə bilmədi.");
        }
      });
    },
    [table.id]
  );

  return {
    table,
    childTablesByCell,
    errorMessage,
    isPending,
    clearError,
    addColumn,
    renameColumn,
    deleteColumn,
    addRow,
    updateCell,
    updateCellMeta,
    deleteRow,
    renameTable,
    createSubTable,
    deleteSubTable,
  };
}
