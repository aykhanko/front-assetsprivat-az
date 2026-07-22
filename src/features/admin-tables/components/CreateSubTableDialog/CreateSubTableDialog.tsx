"use client";

import { FormEvent, useState } from "react";
import { Button, FormField, Input, Modal } from "@/components/ui";
import styles from "./CreateSubTableDialog.module.css";

export interface CreateSubTableDialogProps {
  isOpen: boolean;
  isPending?: boolean;
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

/**
 * Seçilmiş sətrə əsasən yeni alt cədvəl yaratmaq üçün təsdiq dialoqu.
 * Sətrin özü ilə bağlı deyil — hər hansı cədvəldə, istənilən sətirdə
 * eyni şəkildə işləyir (Generic Dynamic Table prinsipi).
 */
export function CreateSubTableDialog({
  isOpen,
  isPending = false,
  onSubmit,
  onCancel,
}: CreateSubTableDialogProps) {
  const [title, setTitle] = useState("");

  const handleClose = () => {
    setTitle("");
    onCancel();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }
    onSubmit(title.trim());
    setTitle("");
  };

  return (
    <Modal isOpen={isOpen} title="Cədvəl yaradılsın?" onClose={handleClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.helperText}>
          Bu sətrə bağlı yeni, tam idarə oluna bilən alt cədvəl yaradılacaq.
          Cədvəlin URL-i başlıq əsasında avtomatik generasiya olunacaq.
        </p>

        <FormField id="sub-table-title" label="Alt cədvəlin adı" required>
          <Input
            id="sub-table-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Məsələn: Müəssisə haqqında məlumatlar"
            autoFocus
          />
        </FormField>

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={handleClose}>
            Ləğv et
          </Button>
          <Button type="submit" isLoading={isPending} disabled={!title.trim()}>
            Bəli, yarat
          </Button>
        </div>
      </form>
    </Modal>
  );
}
