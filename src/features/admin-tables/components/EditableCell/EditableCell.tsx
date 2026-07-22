"use client";

import Link from "next/link";
import { KeyboardEvent, useEffect, useRef } from "react";
import styles from "./EditableCell.module.css";

export type CellNavigationDirection = "next" | "prev" | "down" | "up";

export interface EditableCellProps {
  value: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onCommit: (value: string) => void;
  onCancelEdit: () => void;
  onNavigate: (direction: CellNavigationDirection) => void;
  /** Bu hüceyrəyə bağlı alt cədvəl varsa, dəyər birbaşa hiperlinkə çevrilir. */
  subTableHref?: string;
  onDeleteSubTable?: () => void;
}

/**
 * Generic Dynamic Table hüceyrəsi.
 *
 * Keçid yalnız alt cədvəl olduqda mavi hiperlink kimi görünür; digər
 * hallarda adi mətn kimi göstərilir. Tip seçimi (link/fayl) yoxdur —
 * sistem box/hüceyrə üzərində işləyir.
 */
export function EditableCell({
  value,
  isEditing,
  onStartEdit,
  onCommit,
  onCancelEdit,
  onNavigate,
  subTableHref,
  onDeleteSubTable,
}: EditableCellProps) {
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
        <Link
          href={subTableHref}
          className={styles.subTableValue}
          title="Alt cədvələ bax"
        >
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
        className={styles.textValue}
        onClick={onStartEdit}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") onStartEdit();
        }}
      >
        {value || <span className={styles.placeholder}>—</span>}
      </span>
    </div>
  );
}
