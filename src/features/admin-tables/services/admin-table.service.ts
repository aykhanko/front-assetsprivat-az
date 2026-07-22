import "server-only";
import { getDataSourceMode } from "@/lib/data-source";
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
} from "../validation/table.schema";
import type {
  AdminTable,
  ChildTableSummary,
  ResolvedAdminTable,
} from "../types";
import * as mockProvider from "./providers/mock-admin-table.provider";
import * as apiProvider from "./providers/api-admin-table.provider";

/**
 * Admin Tables servisi.
 *
 * `APP_DATA` mühit dəyişəninə əsasən mock və ya real API provayderinə
 * yönləndirir. Çağıran kod (server action, səhifə) həmişə bu servisi
 * istifadə etməlidir — provayder detalları ilə maraqlanmamalıdır.
 */
function isApiMode(): boolean {
  return getDataSourceMode() === "api";
}

export async function resolveTableByPath(
  pathSegments: string[]
): Promise<ResolvedAdminTable | null> {
  return isApiMode()
    ? apiProvider.resolveTableByPathWithApiProvider(pathSegments)
    : mockProvider.resolveTableByPathWithMockProvider(pathSegments);
}

export async function getRootTables(): Promise<AdminTable[]> {
  return isApiMode()
    ? apiProvider.getRootTablesWithApiProvider()
    : mockProvider.getRootTablesWithMockProvider();
}

export async function getChildTablesByCell(
  tableId: string
): Promise<Record<string, Record<string, ChildTableSummary[]>>> {
  return isApiMode()
    ? apiProvider.getChildTablesByCellWithApiProvider(tableId)
    : mockProvider.getChildTablesByCellWithMockProvider(tableId);
}

export async function addColumn(input: AddColumnInput): Promise<AdminTable> {
  return isApiMode()
    ? apiProvider.addColumnWithApiProvider(input)
    : mockProvider.addColumnWithMockProvider(input);
}

export async function renameColumn(
  input: RenameColumnInput
): Promise<AdminTable> {
  return isApiMode()
    ? apiProvider.renameColumnWithApiProvider(input)
    : mockProvider.renameColumnWithMockProvider(input);
}

export async function deleteColumn(
  input: DeleteColumnInput
): Promise<AdminTable> {
  return isApiMode()
    ? apiProvider.deleteColumnWithApiProvider(input)
    : mockProvider.deleteColumnWithMockProvider(input);
}

export async function addRow(input: AddRowInput): Promise<AdminTable> {
  return isApiMode()
    ? apiProvider.addRowWithApiProvider(input)
    : mockProvider.addRowWithMockProvider(input);
}

export async function updateCell(
  input: UpdateCellInput
): Promise<AdminTable> {
  return isApiMode()
    ? apiProvider.updateCellWithApiProvider(input)
    : mockProvider.updateCellWithMockProvider(input);
}

export async function deleteRow(input: DeleteRowInput): Promise<AdminTable> {
  return isApiMode()
    ? apiProvider.deleteRowWithApiProvider(input)
    : mockProvider.deleteRowWithMockProvider(input);
}

export async function renameTable(
  input: RenameTableInput
): Promise<AdminTable> {
  return isApiMode()
    ? apiProvider.renameTableWithApiProvider(input)
    : mockProvider.renameTableWithMockProvider(input);
}

export async function createSubTable(
  input: CreateSubTableInput
): Promise<{ childTable: AdminTable }> {
  return isApiMode()
    ? apiProvider.createSubTableWithApiProvider(input)
    : mockProvider.createSubTableWithMockProvider(input);
}

export async function deleteSubTable(input: DeleteSubTableInput): Promise<void> {
  return isApiMode()
    ? apiProvider.deleteSubTableWithApiProvider(input)
    : mockProvider.deleteSubTableWithMockProvider(input);
}
