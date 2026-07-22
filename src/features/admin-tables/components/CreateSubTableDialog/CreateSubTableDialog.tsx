"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, FormField, Input, Modal } from "@/components/ui";
import type { AdminColumn, AdminRow, ChildTableSummary } from "../../types";
import styles from "./CreateSubTableDialog.module.css";

export interface CreateSubTableDialogProps {
  isOpen: boolean;
  isPending?: boolean;
  row: AdminRow | null;
  columns: AdminColumn[];
  /** Bu sətrin sütun ID-sinə görə mövcud alt cədvəlləri (əgər varsa). */
  existingByColumn: Record<string, ChildTableSummary[]>;
  /** Cari cədvəlin admin marşrut yolu — mövcud alt cədvələ "Bax" linki üçün. */
  path: string[];
  onSubmit: (columnId: string, title: string) => void;
  onDeleteExisting: (columnId: string, childTableId: string) => void;
  onCancel: () => void;
}

/**
 * Seçilmiş sətrin datalarından hansının alt cədvələ çevriləcəyini seçmək
 * üçün təsdiq dialoqu. Artıq alt cədvəli olan datalar seçim üçün deyil,
 * "Bax" / "Sil" əməliyyatları ilə göstərilir. Datanın öz dəyəri varsa,
 * cədvəlin adı avtomatik həmin dəyərlə doldurulur və ayrıca soruşulmur —
 * lazım gələrsə admin adı dəyişə bilər.
 */
export function CreateSubTableDialog({
  isOpen,
  isPending = false,
  row,
  columns,
  existingByColumn,
  path,
  onSubmit,
  onDeleteExisting,
  onCancel,
}: CreateSubTableDialogProps) {
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isTitleEditable, setIsTitleEditable] = useState(true);
  const [confirmingDeleteColumnId, setConfirmingDeleteColumnId] = useState<
    string | null
  >(null);

  const resetForm = () => {
    setSelectedColumnId(null);
    setTitle("");
    setIsTitleEditable(true);
    setConfirmingDeleteColumnId(null);
  };

  const selectColumn = (column: AdminColumn) => {
    setSelectedColumnId(column.id);
    const cellValue = (row?.values[column.key] ?? "").trim();
    if (cellValue) {
      setTitle(cellValue);
      setIsTitleEditable(false);
    } else {
      setTitle("");
      setIsTitleEditable(true);
    }
  };

  const handleClose = () => {
    resetForm();
    onCancel();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedColumnId || !title.trim()) {
      return;
    }
    onSubmit(selectedColumnId, title.trim());
    resetForm();
  };

  const selectableColumns = columns.filter(
    (column) => (existingByColumn[column.id] ?? []).length === 0
  );
  const columnsWithExisting = columns.filter(
    (column) => (existingByColumn[column.id] ?? []).length > 0
  );

  return (
    <Modal isOpen={isOpen} title="Cədvəl yaradılsın?" onClose={handleClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.helperText}>
          Bu sətrin hansı datası üçün alt cədvəl yaradılacağını seçin. Alt
          cədvəl seçilmiş dataya bağlanacaq və tam idarə oluna bilən boş
          cədvəl olaraq açılacaq.
        </p>

        {columnsWithExisting.length > 0 ? (
          <div className={styles.existingList}>
            <p className={styles.existingListTitle}>
              Artıq alt cədvəli olan datalar:
            </p>
            {columnsWithExisting.map((column) =>
              (existingByColumn[column.id] ?? []).map((child) => (
                <div key={child.id} className={styles.existingRow}>
                  <span className={styles.existingLabel}>{column.label}:</span>
                  <Link
                    href={`/admin/${[...path, child.slug].join("/")}`}
                    className={styles.existingLink}
                  >
                    {child.title}
                  </Link>
                  {confirmingDeleteColumnId === child.id ? (
                    <span className={styles.inlineConfirm}>
                      Silinsin?
                      <button
                        type="button"
                        className={styles.inlineConfirmYes}
                        onClick={() => {
                          onDeleteExisting(column.id, child.id);
                          setConfirmingDeleteColumnId(null);
                        }}
                      >
                        Bəli
                      </button>
                      <button
                        type="button"
                        className={styles.inlineConfirmNo}
                        onClick={() => setConfirmingDeleteColumnId(null)}
                      >
                        Xeyr
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className={styles.existingDelete}
                      onClick={() => setConfirmingDeleteColumnId(child.id)}
                    >
                      Sil
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        ) : null}

        <div className={styles.cellList} role="radiogroup" aria-label="Data seçimi">
          {selectableColumns.map((column) => {
            const value = row?.values[column.key] ?? "";
            const isSelected = selectedColumnId === column.id;
            return (
              <label
                key={column.id}
                className={
                  isSelected ? `${styles.cellOption} ${styles.cellOptionSelected}` : styles.cellOption
                }
              >
                <input
                  type="radio"
                  name="sub-table-column"
                  className={styles.radio}
                  checked={isSelected}
                  onChange={() => selectColumn(column)}
                />
                <span className={styles.cellOptionText}>
                  <span className={styles.cellOptionLabel}>{column.label}</span>
                  <span className={styles.cellOptionValue}>
                    {value || <span className={styles.emptyValue}>(boş)</span>}
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        {selectedColumnId ? (
          isTitleEditable ? (
            <FormField id="sub-table-title" label="Alt cədvəlin adı" required>
              <Input
                id="sub-table-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Məsələn: Müəssisə haqqında məlumatlar"
              />
            </FormField>
          ) : (
            <p className={styles.autoTitle}>
              Cədvəlin adı: <strong>{title}</strong>{" "}
              <button
                type="button"
                className={styles.changeTitleButton}
                onClick={() => setIsTitleEditable(true)}
              >
                Dəyişdir
              </button>
            </p>
          )
        ) : null}

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={handleClose}>
            Ləğv et
          </Button>
          <Button
            type="submit"
            isLoading={isPending}
            disabled={!title.trim() || !selectedColumnId}
          >
            Bəli, yarat
          </Button>
        </div>
      </form>
    </Modal>
  );
}
