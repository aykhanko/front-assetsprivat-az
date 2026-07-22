"use server";

import { revalidatePath } from "next/cache";
import {
  addColumnSchema,
  createSubTableSchema,
  deleteColumnSchema,
  deleteRowSchema,
  renameColumnSchema,
  renameTableSchema,
  addRowSchema,
  updateCellSchema,
} from "../validation/table.schema";
import {
  addColumn,
  addRow,
  createSubTable,
  deleteColumn,
  deleteRow,
  renameColumn,
  renameTable,
  updateCell,
} from "../services/admin-table.service";
import type { AdminTable } from "../types";

/**
 * Admin Tables Server Actions.
 *
 * Hər action `AdminTableView` (client komponent) tərəfindən çağırılır və
 * yenilənmiş cədvəli qaytarır — bu sayədə UI tam səhifə yenilənməsi
 * olmadan optimistik şəkildə yenilənir. `revalidatePath` isə digər
 * tab/naviqasiyalarda datanın təzə qalmasını təmin edir.
 */
export interface AdminTableActionResult {
  success: boolean;
  message?: string;
  table?: AdminTable;
}

export interface CreateSubTableActionResult {
  success: boolean;
  message?: string;
  childTable?: AdminTable;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Naməlum xəta baş verdi.";
}

function revalidateAdmin(): void {
  revalidatePath("/admin", "layout");
}

export async function addColumnAction(
  input: unknown
): Promise<AdminTableActionResult> {
  const parsed = addColumnSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  try {
    const table = await addColumn(parsed.data);
    revalidateAdmin();
    return { success: true, table };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function renameColumnAction(
  input: unknown
): Promise<AdminTableActionResult> {
  const parsed = renameColumnSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  try {
    const table = await renameColumn(parsed.data);
    revalidateAdmin();
    return { success: true, table };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function deleteColumnAction(
  input: unknown
): Promise<AdminTableActionResult> {
  const parsed = deleteColumnSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  try {
    const table = await deleteColumn(parsed.data);
    revalidateAdmin();
    return { success: true, table };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function addRowAction(
  input: unknown
): Promise<AdminTableActionResult> {
  const parsed = addRowSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  try {
    const table = await addRow(parsed.data);
    revalidateAdmin();
    return { success: true, table };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function updateCellAction(
  input: unknown
): Promise<AdminTableActionResult> {
  const parsed = updateCellSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  try {
    const table = await updateCell(parsed.data);
    revalidateAdmin();
    return { success: true, table };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function deleteRowAction(
  input: unknown
): Promise<AdminTableActionResult> {
  const parsed = deleteRowSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  try {
    const table = await deleteRow(parsed.data);
    revalidateAdmin();
    return { success: true, table };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function renameTableAction(
  input: unknown
): Promise<AdminTableActionResult> {
  const parsed = renameTableSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  try {
    const table = await renameTable(parsed.data);
    revalidateAdmin();
    return { success: true, table };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function createSubTableAction(
  input: unknown
): Promise<CreateSubTableActionResult> {
  const parsed = createSubTableSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  try {
    const { childTable } = await createSubTable(parsed.data);
    revalidateAdmin();
    return { success: true, childTable };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}
