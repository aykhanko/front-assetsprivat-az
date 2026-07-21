import { ReactNode } from "react";
import styles from "./FormField.module.css";

export interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function FormField({
  id,
  label,
  children,
  error,
  hint,
  required,
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <span className={styles.required}> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className={styles.hint}>{hint}</p>
      ) : null}
    </div>
  );
}
