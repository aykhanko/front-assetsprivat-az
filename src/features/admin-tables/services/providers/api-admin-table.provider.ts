import type {
  AddColumnInput,
  AddRowInput,
  CreateSubTableInput,
  DeleteColumnInput,
  DeleteRowInput,
  RenameColumnInput,
  RenameTableInput,
  UpdateCellInput,
} from "../../validation/table.schema";
import type { AdminTable, ChildTableSummary, ResolvedAdminTable } from "../../types";

/**
 * Real API provayderi — `APP_DATA=api` seçildikdə istifadə olunacaq.
 * Hazırda YALNIZ placeholder-lardır. Hər funksiya üçün gözlənilən
 * endpoint/kontrakt `docs/admin-panel-api.md`-də sənədləşdirilib.
 */
function notImplemented(action: string): never {
  throw new Error(
    `Admin Tables API provayderi hələ hazır deyil: "${action}". Bax: docs/admin-panel-api.md`
  );
}

export async function resolveTableByPathWithApiProvider(
  _pathSegments: string[]
): Promise<ResolvedAdminTable | null> {
  return notImplemented("resolveTableByPath");
}

export async function getRootTablesWithApiProvider(): Promise<AdminTable[]> {
  return notImplemented("getRootTables");
}

export async function getChildTablesByRowWithApiProvider(
  _tableId: string
): Promise<Record<string, ChildTableSummary[]>> {
  return notImplemented("getChildTablesByRow");
}

export async function addColumnWithApiProvider(
  _input: AddColumnInput
): Promise<AdminTable> {
  return notImplemented("addColumn");
}

export async function renameColumnWithApiProvider(
  _input: RenameColumnInput
): Promise<AdminTable> {
  return notImplemented("renameColumn");
}

export async function deleteColumnWithApiProvider(
  _input: DeleteColumnInput
): Promise<AdminTable> {
  return notImplemented("deleteColumn");
}

export async function addRowWithApiProvider(
  _input: AddRowInput
): Promise<AdminTable> {
  return notImplemented("addRow");
}

export async function updateCellWithApiProvider(
  _input: UpdateCellInput
): Promise<AdminTable> {
  return notImplemented("updateCell");
}

export async function deleteRowWithApiProvider(
  _input: DeleteRowInput
): Promise<AdminTable> {
  return notImplemented("deleteRow");
}

export async function renameTableWithApiProvider(
  _input: RenameTableInput
): Promise<AdminTable> {
  return notImplemented("renameTable");
}

export async function createSubTableWithApiProvider(
  _input: CreateSubTableInput
): Promise<{ childTable: AdminTable }> {
  return notImplemented("createSubTable");
}
