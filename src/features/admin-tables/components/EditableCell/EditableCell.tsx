"use client";

import Link from "next/link";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import type { AdminColumnType } from "../../types";
import styles from "./EditableCell.module.css";

export type CellNavigationDirection = "next" | "prev" | "down" | "up";

export interface EditableCellProps {
  value: string;
  type: AdminColumnType;
  isEditing: boolean;
  onStartEdit: () => void;
  onCommit: (value: string) => void;
  onCancelEdit: () => void;
  onNavigate: (direction: CellNavigationDirection) => void;
  /** Bu hüceyrəyə bağlı alt cədvəl varsa, dəyər birbaşa bu ünvana keçid linkinə çevrilir. */
  subTableHref?: string;
  /** Mövcuddursa, alt cədvəli silmək üçün kiçik zibil qutusu ikonu göstərilir. */
  onDeleteSubTable?: () => void;
}

/**
 * Generic Dynamic Table hüceyrəsi.
 *
 * - Redaktə rejimi valideyn komponent tərəfindən idarə olunur ki, klaviatura
 *   ilə (Tab / Shift+Tab / Enter / Shift+Enter) hüceyrələr arası keçid mümkün
 *   olsun — mouse ilə hər dəfə klikləməyə ehtiyac qalmır.
 * - Alt cədvəli olan hüceyrələrdə dəyərin özü birbaşa hiperlinkə çevrilir.
 * - `file` tipli sütunlarda mətn və fayl/şəkil üçün ayrıca doldurma
 *   seçimləri göstərilir (fayl yükləmə hələ placeholder-dır).
 */
export function EditableCell({
  value,
  type,
  isEditing,
  onStartEdit,
  onCommit,
  onCancelEdit,
  onNavigate,
  subTableHref,
  onDeleteSubTable,
}: EditableCellProps) {
  const [fileFillMode, setFileFillMode] = useState<"text" | "file">("text");
  const inputRef = useRef<HTMLInputElement>(null);
  const hasCommittedRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      hasCommittedRef.current = false;
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isEditing]);

  const commitIfChanged = () => {
    const nextValue = inputRef.current?.value ?? value;
    if (!hasCommittedRef.current && nextValue !== value) {
      hasCommittedRef.current = true;
      onCommit(nextValue);
    }
  };

  const handleBlur = () => {
    commitIfChanged();
    onCancelEdit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitIfChanged();
      onNavigate(event.shiftKey ? "up" : "down");
    } else if (event.key === "Tab") {
      event.preventDefault();
      commitIfChanged();
      onNavigate(event.shiftKey ? "prev" : "next");
    } else if (event.key === "Escape") {
      hasCommittedRef.current = true;
      onCancelEdit();
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        className={styles.input}
        defaultValue={value}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    );
  }

  if (subTableHref) {
    return (
      <div className={styles.cell}>
        <Link href={subTableHref} className={styles.subTableValue} title="Alt cədvələ bax">
          <span className={styles.subTableIcon} aria-hidden="true">
            🗂
          </span>
          {value || <span className={styles.placeholder}>—</span>}
        </Link>
        <button
          type="button"
          className={styles.editIconButton}
          onClick={onStartEdit}
          title="Dəyəri redaktə et"
          aria-label="Dəyəri redaktə et"
        >
          ✎
        </button>
        {onDeleteSubTable ? (
          <button
            type="button"
            className={styles.deleteIconButton}
            onClick={onDeleteSubTable}
            title="Alt cədvəli sil"
            aria-label="Alt cədvəli sil"
          >
            🗑
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.cell}>
      <span
        className={type === "link" ? styles.linkValue : styles.textValue}
        onClick={onStartEdit}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") onStartEdit();
        }}
      >
        {value || <span className={styles.placeholder}>—</span>}
      </span>

      {type === "file" ? (
        <div className={styles.fileModeRow}>
          <div className={styles.fileModeToggle} role="group" aria-label="Doldurma üsulu">
            <button
              type="button"
              className={
                fileFillMode === "text"
                  ? `${styles.fileModeButton} ${styles.fileModeButtonActive}`
                  : styles.fileModeButton
              }
              onClick={() => setFileFillMode("text")}
            >
              📝 Mətn
            </button>
            <button
              type="button"
              className={
                fileFillMode === "file"
                  ? `${styles.fileModeButton} ${styles.fileModeButtonActive}`
                  : styles.fileModeButton
              }
              onClick={() => setFileFillMode("file")}
            >
              🖼 Şəkil/Fayl
            </button>
          </div>

          {fileFillMode === "file" ? (
            <button
              type="button"
              className={styles.uploadPlaceholder}
              disabled
              title="Fayl yükləmə funksiyası tezliklə əlavə olunacaq"
            >
              Fayl/şəkil seç (tezliklə)
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
