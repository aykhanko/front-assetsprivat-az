"use client";

import { FormEvent, useState } from "react";
import { Button, FormField, Input, Modal } from "@/components/ui";
import styles from "./AddColumnDialog.module.css";

export interface AddColumnDialogProps {
  isOpen: boolean;
  isPending?: boolean;
  onSubmit: (label: string) => void;
  onCancel: () => void;
}

export function AddColumnDialog({
  isOpen,
  isPending = false,
  onSubmit,
  onCancel,
}: AddColumnDialogProps) {
  const [label, setLabel] = useState("");

  const handleClose = () => {
    setLabel("");
    onCancel();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!label.trim()) {
      return;
    }
    onSubmit(label.trim());
    setLabel("");
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
