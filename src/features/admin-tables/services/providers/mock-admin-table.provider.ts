import * as repository from "../../repositories/admin-table.repository";
import { ensureUniqueSlug, slugify, slugifyKey } from "../../utils/slugify";
import { generateId } from "../../utils/id";
import type {
  AddColumnInput,
  AddRowInput,
  CreateSubTableInput,
  DeleteColumnInput,
  DeleteRowInput,
  DeleteSubTableInput,
  RenameColumnInput,
  RenameTableInput,
  UpdateCellInput,
} from "../../validation/table.schema";
import type {
  AdminColumn,
  AdminRow,
  AdminTable,
  AdminTableBreadcrumb,
  ChildTableSummary,
  ResolvedAdminTable,
} from "../../types";

/**
 * Mock provayder — `APP_DATA=mock` olduqda istifadə olunur. Bütün Generic
 * Dynamic Table biznes qaydaları burada tətbiq olunur, sonra dəyişiklik
 * repository vasitəsilə JSON store-a yazılır.
 */
function touch(table: AdminTable): AdminTable {
  return { ...table, updatedAt: new Date().toISOString() };
}

function toChildSummary(table: AdminTable): ChildTableSummary {
  return { id: table.id, slug: table.slug, title: table.title };
}

async function requireTable(tableId: string): Promise<AdminTable> {
  const table = await repository.findTableById(tableId);

  if (!table) {
    throw new Error("Cədvəl tapılmadı.");
  }

  return table;
}

export async function resolveTableByPathWithMockProvider(
  pathSegments: string[]
): Promise<ResolvedAdminTable | null> {
  if (pathSegments.length === 0) {
    return null;
  }

  const [rootSlug, ...rest] = pathSegments;
  let current = await repository.findRootTableBySlug(rootSlug);

  if (!current) {
    return null;
  }

  const breadcrumbs: AdminTableBreadcrumb[] = [
    { id: current.id, slug: current.slug, title: current.title },
  ];

  for (const slug of rest) {
    const child = await repository.findChildTableBySlug(current.id, slug);

    if (!child) {
      return null;
    }

    current = child;
    breadcrumbs.push({ id: current.id, slug: current.slug, title: current.title });
  }

  return { table: current, breadcrumbs, path: pathSegments };
}

export async function getRootTablesWithMockProvider(): Promise<AdminTable[]> {
  return repository.findRootTables();
}

export async function getChildTablesByCellWithMockProvider(
  tableId: string
): Promise<Record<string, Record<string, ChildTableSummary[]>>> {
  const children = await repository.findChildTables(tableId);
  const grouped: Record<string, Record<string, ChildTableSummary[]>> = {};

  for (const child of children) {
    if (!child.parentRowId || !child.parentCellColumnId) {
      continue;
    }

    const byColumn = grouped[child.parentRowId] ?? {};
    const list = byColumn[child.parentCellColumnId] ?? [];
    list.push(toChildSummary(child));
    byColumn[child.parentCellColumnId] = list;
    grouped[child.parentRowId] = byColumn;
  }

  return grouped;
}

export async function addColumnWithMockProvider({
  tableId,
  label,
  type,
}: AddColumnInput): Promise<AdminTable> {
  const table = await requireTable(tableId);
  const key = ensureUniqueSlug(
    slugifyKey(label),
    table.columns.map((column) => column.key)
  );

  const column: AdminColumn = {
    id: generateId("col"),
    key,
    label,
    type,
    order: table.columns.length,
  };

  const updated = touch({
    ...table,
    columns: [...table.columns, column],
    rows: table.rows.map((row) => ({
      ...row,
      values: { ...row.values, [key]: "" },
    })),
  });

  return repository.replaceTable(updated);
}

export async function renameColumnWithMockProvider({
  tableId,
  columnId,
  label,
}: RenameColumnInput): Promise<AdminTable> {
  const table = await requireTable(tableId);

  const columnExists = table.columns.some((column) => column.id === columnId);
  if (!columnExists) {
    throw new Error("Sütun tapılmadı.");
  }

  const updated = touch({
    ...table,
    columns: table.columns.map((column) =>
      column.id === columnId ? { ...column, label } : column
    ),
  });

  return repository.replaceTable(updated);
}

async function collectDescendantTableIdsOf(tableIds: string[]): Promise<string[]> {
  const idsToDelete: string[] = [];

  async function collectChildrenOf(parentTableId: string): Promise<void> {
    const children = await repository.findChildTables(parentTableId);

    for (const child of children) {
      idsToDelete.push(child.id);
      await collectChildrenOf(child.id);
    }
  }

  for (const tableId of tableIds) {
    await collectChildrenOf(tableId);
  }

  return idsToDelete;
}

export async function deleteColumnWithMockProvider({
  tableId,
  columnId,
}: DeleteColumnInput): Promise<AdminTable> {
  const table = await requireTable(tableId);
  const columnToDelete = table.columns.find((column) => column.id === columnId);

  if (!columnToDelete) {
    throw new Error("Sütun tapılmadı.");
  }

  const directSubTables = await repository.findChildTablesForColumn(
    tableId,
    columnId
  );
  const directSubTableIds = directSubTables.map((sub) => sub.id);
  const descendantIds = await collectDescendantTableIdsOf(directSubTableIds);
  const idsToDelete = [...directSubTableIds, ...descendantIds];

  if (idsToDelete.length > 0) {
    await repository.deleteTablesByIds(idsToDelete);
  }

  const updated = touch({
    ...table,
    columns: table.columns
      .filter((column) => column.id !== columnId)
      .map((column, index) => ({ ...column, order: index })),
    rows: table.rows.map((row) => {
      const nextValues = { ...row.values };
      delete nextValues[columnToDelete.key];
      return { ...row, values: nextValues };
    }),
  });

  return repository.replaceTable(updated);
}

export async function addRowWithMockProvider({
  tableId,
}: AddRowInput): Promise<AdminTable> {
  const table = await requireTable(tableId);
  const now = new Date().toISOString();

  const row: AdminRow = {
    id: generateId("row"),
    values: Object.fromEntries(
      table.columns.map((column) => [column.key, ""])
    ),
    createdAt: now,
    updatedAt: now,
  };

  const updated = touch({ ...table, rows: [...table.rows, row] });
  return repository.replaceTable(updated);
}

export async function updateCellWithMockProvider({
  tableId,
  rowId,
  columnId,
  value,
}: UpdateCellInput): Promise<AdminTable> {
  const table = await requireTable(tableId);
  const column = table.columns.find((item) => item.id === columnId);

  if (!column) {
    throw new Error("Sütun tapılmadı.");
  }

  const now = new Date().toISOString();
  const updated = touch({
    ...table,
    rows: table.rows.map((row) =>
      row.id === rowId
        ? { ...row, values: { ...row.values, [column.key]: value }, updatedAt: now }
        : row
    ),
  });

  return repository.replaceTable(updated);
}

export async function deleteRowWithMockProvider({
  tableId,
  rowId,
}: DeleteRowInput): Promise<AdminTable> {
  const table = await requireTable(tableId);

  const directChildren = await repository.findChildTablesForRow(tableId, rowId);
  const directChildIds = directChildren.map((child) => child.id);
  const descendantIds = await collectDescendantTableIdsOf(directChildIds);
  const idsToDelete = [...directChildIds, ...descendantIds];

  if (idsToDelete.length > 0) {
    await repository.deleteTablesByIds(idsToDelete);
  }

  const updated = touch({
    ...table,
    rows: table.rows.filter((row) => row.id !== rowId),
  });

  return repository.replaceTable(updated);
}

export async function renameTableWithMockProvider({
  tableId,
  title,
}: RenameTableInput): Promise<AdminTable> {
  const table = await requireTable(tableId);
  const updated = touch({ ...table, title });
  return repository.replaceTable(updated);
}

export async function createSubTableWithMockProvider({
  tableId,
  rowId,
  columnId,
  title,
}: CreateSubTableInput): Promise<{ childTable: AdminTable }> {
  const table = await requireTable(tableId);

  const row = table.rows.find((item) => item.id === rowId);
  if (!row) {
    throw new Error("Sətir tapılmadı.");
  }

  const column = table.columns.find((item) => item.id === columnId);
  if (!column) {
    throw new Error("Sütun tapılmadı.");
  }

  const siblingTables = await repository.findChildTables(tableId);
  const slug = ensureUniqueSlug(
    slugify(title),
    siblingTables.map((sibling) => sibling.slug)
  );

  const now = new Date().toISOString();
  const childTable: AdminTable = {
    id: generateId("table"),
    slug,
    title,
    columns: [],
    rows: [],
    parentTableId: tableId,
    parentRowId: rowId,
    parentCellColumnId: columnId,
    createdAt: now,
    updatedAt: now,
  };

  await repository.insertTable(childTable);
  return { childTable };
}

export async function deleteSubTableWithMockProvider({
  parentTableId,
  childTableId,
}: DeleteSubTableInput): Promise<void> {
  const childTable = await repository.findTableById(childTableId);

  if (!childTable || childTable.parentTableId !== parentTableId) {
    throw new Error("Alt cədvəl tapılmadı.");
  }

  const descendantIds = await collectDescendantTableIdsOf([childTableId]);
  await repository.deleteTablesByIds([childTableId, ...descendantIds]);
}
