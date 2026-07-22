"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ConfirmDialog } from "../ConfirmDialog";
import type { AdminColumn } from "../../types";
import styles from "./ColumnMenu.module.css";

export interface ColumnMenuProps {
  column: AdminColumn;
  isPending?: boolean;
  onRename: (columnId: string, label: string) => void;
  onDelete: (columnId: string) => void;
}

/**
 * Sütun başlığındakı "..." düyməsi — sütun adını dəyişmək və ya sütunu
 * silmək üçün kiçik açılan menyu.
 */
export function ColumnMenu({
  column,
  isPending = false,
  onRename,
  onDelete,
}: ColumnMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [draftLabel, setDraftLabel] = useState(column.label);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsRenaming(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRenameSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = draftLabel.trim();
    if (trimmed && trimmed !== column.label) {
      onRename(column.id, trimmed);
    }
    setIsRenaming(false);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Sütun əməliyyatları"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        ⋮
      </button>

      {isOpen ? (
        <div className={styles.dropdown} role="menu">
          {isRenaming ? (
            <form className={styles.renameForm} onSubmit={handleRenameSubmit}>
              <input
                className={styles.renameInput}
                value={draftLabel}
                onChange={(event) => setDraftLabel(event.target.value)}
                autoFocus
              />
              <button type="submit" className={styles.renameSubmit}>
                Yadda saxla
              </button>
            </form>
          ) : (
            <>
              <button
                type="button"
                role="menuitem"
                className={styles.menuItem}
                onClick={() => {
                  setDraftLabel(column.label);
                  setIsRenaming(true);
                }}
              >
                Adı dəyişdir
              </button>
              <button
                type="button"
                role="menuitem"
                className={styles.menuItemDanger}
                onClick={() => {
                  setIsConfirmingDelete(true);
                  setIsOpen(false);
                }}
              >
                Sütunu sil
              </button>
            </>
          )}
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={isConfirmingDelete}
        title="Sütunu sil"
        message={`"${column.label}" sütununu silmək istədiyinizə əminsiniz? Bu sütuna aid bütün hüceyrə dəyərləri silinəcək.`}
        isPending={isPending}
        onConfirm={() => {
          onDelete(column.id);
          setIsConfirmingDelete(false);
        }}
        onCancel={() => setIsConfirmingDelete(false)}
      />
    </div>
  );
}
