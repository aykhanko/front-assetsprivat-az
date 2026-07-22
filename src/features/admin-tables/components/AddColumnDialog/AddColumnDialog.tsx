"use client";

import { FormEvent, useState } from "react";
import { Button, FormField, Input, Modal } from "@/components/ui";
import { COLUMN_TYPE_OPTIONS } from "../../constants";
import type { AdminColumnType } from "../../types";
import styles from "./AddColumnDialog.module.css";

export interface AddColumnDialogProps {
  isOpen: boolean;
  isPending?: boolean;
  onSubmit: (label: string, type: AdminColumnType) => void;
  onCancel: () => void;
}

export function AddColumnDialog({
  isOpen,
  isPending = false,
  onSubmit,
  onCancel,
}: AddColumnDialogProps) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<AdminColumnType>("text");

  const handleClose = () => {
    setLabel("");
    setType("text");
    onCancel();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!label.trim()) {
      return;
    }
    onSubmit(label.trim(), type);
    setLabel("");
    setType("text");
  };

  return (
    <Modal isOpen={isOpen} title="Yeni sütun əlavə et" onClose={handleClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField id="new-column-label" label="Sütun adı" required>
          <Input
            id="new-column-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Məsələn: Əlaqə nömrəsi"
            autoFocus
          />
        </FormField>

        <FormField id="new-column-type" label="Sütun tipi" required>
          <select
            id="new-column-type"
            className={styles.select}
            value={type}
            onChange={(event) => setType(event.target.value as AdminColumnType)}
          >
            {COLUMN_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={handleClose}>
            Ləğv et
          </Button>
          <Button type="submit" isLoading={isPending} disabled={!label.trim()}>
            Əlavə et
          </Button>
        </div>
      </form>
    </Modal>
  );
}
