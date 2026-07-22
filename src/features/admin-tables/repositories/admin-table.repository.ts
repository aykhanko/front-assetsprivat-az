import "server-only";
import {
  mutateAdminTables,
  readAdminTables,
} from "@/lib/mock-db/admin-tables.store";
import type { AdminTable } from "../types";

/**
 * Admin Tables repository — mock JSON store üzərində birbaşa CRUD.
 * Servis qatı YALNIZ bu repository ilə danışmalıdır, `mock-db` detallarını
 * bilməməlidir.
 */
export async function getAllTables(): Promise<AdminTable[]> {
  return readAdminTables();
}

export async function findTableById(
  tableId: string
): Promise<AdminTable | undefined> {
  const tables = await readAdminTables();
  return tables.find((table) => table.id === tableId);
}

export async function findRootTables(): Promise<AdminTable[]> {
  const tables = await readAdminTables();
  return tables.filter((table) => table.parentTableId === null);
}

export async function findRootTableBySlug(
  slug: string
): Promise<AdminTable | undefined> {
  const tables = await readAdminTables();
  return tables.find(
    (table) => table.parentTableId === null && table.slug === slug
  );
}

export async function findChildTables(
  tableId: string
): Promise<AdminTable[]> {
  const tables = await readAdminTables();
  return tables.filter((table) => table.parentTableId === tableId);
}

export async function findChildTablesForRow(
  tableId: string,
  rowId: string
): Promise<AdminTable[]> {
  const tables = await readAdminTables();
  return tables.filter(
    (table) => table.parentTableId === tableId && table.parentRowId === rowId
  );
}

export async function findChildTableBySlug(
  parentTableId: string,
  slug: string
): Promise<AdminTable | undefined> {
  const tables = await readAdminTables();
  return tables.find(
    (table) => table.parentTableId === parentTableId && table.slug === slug
  );
}

export async function insertTable(table: AdminTable): Promise<AdminTable> {
  await mutateAdminTables((tables) => [...tables, table]);
  return table;
}

export async function replaceTable(
  updatedTable: AdminTable
): Promise<AdminTable> {
  await mutateAdminTables((tables) => {
    const index = tables.findIndex((table) => table.id === updatedTable.id);

    if (index === -1) {
      throw new Error(`Cədvəl tapılmadı: ${updatedTable.id}`);
    }

    const next = [...tables];
    next[index] = updatedTable;
    return next;
  });

  return updatedTable;
}

export async function deleteTablesByIds(tableIds: string[]): Promise<void> {
  if (tableIds.length === 0) {
    return;
  }

  const idsToDelete = new Set(tableIds);
  await mutateAdminTables((tables) =>
    tables.filter((table) => !idsToDelete.has(table.id))
  );
}
