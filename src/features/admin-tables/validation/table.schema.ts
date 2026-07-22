import { z } from "zod";
import {
  MAX_CELL_VALUE_LENGTH,
  MAX_COLUMN_LABEL_LENGTH,
  MAX_TABLE_TITLE_LENGTH,
} from "../constants";

export const addColumnSchema = z.object({
  tableId: z.string().min(1),
  label: z
    .string()
    .min(1, "Sütun adı tələb olunur")
    .max(MAX_COLUMN_LABEL_LENGTH, "Sütun adı çox uzundur"),
  type: z.enum(["text", "link", "file"]),
});

export const renameColumnSchema = z.object({
  tableId: z.string().min(1),
  columnId: z.string().min(1),
  label: z
    .string()
    .min(1, "Sütun adı tələb olunur")
    .max(MAX_COLUMN_LABEL_LENGTH, "Sütun adı çox uzundur"),
});

export const deleteColumnSchema = z.object({
  tableId: z.string().min(1),
  columnId: z.string().min(1),
});

export const addRowSchema = z.object({
  tableId: z.string().min(1),
});

export const updateCellSchema = z.object({
  tableId: z.string().min(1),
  rowId: z.string().min(1),
  columnId: z.string().min(1),
  value: z.string().max(MAX_CELL_VALUE_LENGTH, "Dəyər çox uzundur"),
});

export const deleteRowSchema = z.object({
  tableId: z.string().min(1),
  rowId: z.string().min(1),
});

export const renameTableSchema = z.object({
  tableId: z.string().min(1),
  title: z
    .string()
    .min(1, "Cədvəl adı tələb olunur")
    .max(MAX_TABLE_TITLE_LENGTH, "Cədvəl adı çox uzundur"),
});

export const createSubTableSchema = z.object({
  tableId: z.string().min(1),
  rowId: z.string().min(1),
  title: z
    .string()
    .min(1, "Cədvəl adı tələb olunur")
    .max(MAX_TABLE_TITLE_LENGTH, "Cədvəl adı çox uzundur"),
});

export type AddColumnInput = z.infer<typeof addColumnSchema>;
export type RenameColumnInput = z.infer<typeof renameColumnSchema>;
export type DeleteColumnInput = z.infer<typeof deleteColumnSchema>;
export type AddRowInput = z.infer<typeof addRowSchema>;
export type UpdateCellInput = z.infer<typeof updateCellSchema>;
export type DeleteRowInput = z.infer<typeof deleteRowSchema>;
export type RenameTableInput = z.infer<typeof renameTableSchema>;
export type CreateSubTableInput = z.infer<typeof createSubTableSchema>;
