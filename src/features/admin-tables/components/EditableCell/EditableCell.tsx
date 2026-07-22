"use client";

import { KeyboardEvent, useState } from "react";
import type { AdminColumnType } from "../../types";
import styles from "./EditableCell.module.css";

export interface EditableCellProps {
  value: string;
  type: AdminColumnType;
  onSave: (value: string) => void;
}

/**
 * Generic Dynamic Table hüceyrəsi — klikləndikdə redaktə rejiminə keçir.
 * `link` tipli sütunlar mavi/altı xətli görünür, `file` tipli sütunlar
 * yanında deaktiv "Yüklə" placeholder düyməsi ilə göstərilir.
 */
export function EditableCell({ value, type, onSave }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const startEditing = () => {
    setDraft(value);
    setIsEditing(true);
  };

  const commit = () => {
    setIsEditing(false);
    if (draft !== value) {
      onSave(draft);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      setDraft(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        className={styles.input}
        value={draft}
        autoFocus
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <div className={styles.cell}>
      <span
        className={type === "link" ? styles.linkValue : styles.textValue}
        onClick={startEditing}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") startEditing();
        }}
      >
        {value || <span className={styles.placeholder}>—</span>}
      </span>

      {type === "file" ? (
        <button
          type="button"
          className={styles.uploadPlaceholder}
          disabled
          title="Fayl yükləmə funksiyası tezliklə əlavə olunacaq"
        >
          Fayl yüklə (tezliklə)
        </button>
      ) : null}
    </div>
  );
}
