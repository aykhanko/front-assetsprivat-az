"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { AdminCellMeta } from "../../types";
import { toAbsoluteExternalUrl } from "../../utils/external-url";
import styles from "./EditableCell.module.css";

export type CellNavigationDirection = "next" | "prev" | "down" | "up";

export interface EditableCellProps {
  value: string;
  cellMeta?: AdminCellMeta;
  isEditing: boolean;
  onStartEdit: () => void;
  onCommit: (value: string) => void;
  onCancelEdit: () => void;
  onNavigate: (direction: CellNavigationDirection) => void;
  onUpdateMeta: (meta: {
    externalUrl?: string;
    clearExternalUrl?: boolean;
  }) => void;
  /** Bu hüceyrəyə bağlı alt cədvəl varsa, dəyər birbaşa hiperlinkə çevrilir. */
  subTableHref?: string;
  onDeleteSubTable?: () => void;
}

/**
 * Generic Dynamic Table hüceyrəsi.
 *
 * - Mətn redaktəsi + klaviatura naviqasiyası
 * - Alt cədvəl və ya xarici URL olduqda mavi hiperlink
 * - 🔗 ilə xarici URL idarəsi (upload ikonu yoxdur)
 */
export function EditableCell({
  value,
  cellMeta,
  isEditing,
  onStartEdit,
  onCommit,
  onCancelEdit,
  onNavigate,
  onUpdateMeta,
  subTableHref,
  onDeleteSubTable,
}: EditableCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasCommittedRef = useRef(false);
  const [isLinkPanelOpen, setIsLinkPanelOpen] = useState(false);
  const [linkDraft, setLinkDraft] = useState(cellMeta?.externalUrl ?? "");

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

  const openLinkPanel = () => {
    setLinkDraft(cellMeta?.externalUrl ?? "");
    setIsLinkPanelOpen(true);
  };

  const saveLink = (event: FormEvent) => {
    event.preventDefault();
    onUpdateMeta({ externalUrl: linkDraft });
    setIsLinkPanelOpen(false);
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

  const hasLink = Boolean(cellMeta?.externalUrl);
  const absoluteExternalUrl = cellMeta?.externalUrl
    ? toAbsoluteExternalUrl(cellMeta.externalUrl)
    : "";

  return (
    <div className={styles.cellWrap}>
      <div className={styles.cell}>
        {subTableHref ? (
          <Link
            href={subTableHref}
            className={styles.subTableValue}
            title="Alt cədvələ bax"
          >
            {value || <span className={styles.placeholder}>—</span>}
          </Link>
        ) : hasLink ? (
          <a
            href={absoluteExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.subTableValue}
            title={absoluteExternalUrl}
          >
            {value || <span className={styles.placeholder}>—</span>}
          </a>
        ) : (
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
        )}

        <div className={styles.iconRow}>
          {subTableHref || hasLink ? (
            <button
              type="button"
              className={styles.editIconButton}
              onClick={onStartEdit}
              title="Dəyəri redaktə et"
              aria-label="Dəyəri redaktə et"
            >
              ✎
            </button>
          ) : null}

          <button
            type="button"
            className={
              hasLink
                ? `${styles.metaIconButton} ${styles.metaIconActive}`
                : styles.metaIconButton
            }
            onClick={openLinkPanel}
            title={hasLink ? "Xarici linki redaktə et" : "Xarici link əlavə et"}
            aria-label="Xarici link"
          >
            🔗
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
      </div>

      {isLinkPanelOpen ? (
        <form className={styles.metaPanel} onSubmit={saveLink}>
          <label className={styles.metaLabel} htmlFor="cell-external-url">
            Xarici link (URL)
          </label>
          <input
            id="cell-external-url"
            className={styles.metaInput}
            value={linkDraft}
            onChange={(event) => setLinkDraft(event.target.value)}
            placeholder="https://... və ya google.com"
            autoFocus
          />
          <div className={styles.metaActions}>
            {hasLink ? (
              <button
                type="button"
                className={styles.metaClear}
                onClick={() => {
                  onUpdateMeta({ clearExternalUrl: true });
                  setIsLinkPanelOpen(false);
                }}
              >
                Sil
              </button>
            ) : null}
            <button
              type="button"
              className={styles.metaCancel}
              onClick={() => setIsLinkPanelOpen(false)}
            >
              Ləğv
            </button>
            <button type="submit" className={styles.metaSave}>
              Saxla
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
