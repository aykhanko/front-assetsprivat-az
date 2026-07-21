import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  startIcon?: ReactNode;
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { hasError = false, startIcon, endAdornment, className, ...rest },
    ref
  ) {
    const classNames = [
      styles.input,
      startIcon ? styles.hasStartIcon : "",
      hasError ? styles.error : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.wrapper}>
        {startIcon ? (
          <span className={styles.startIcon} aria-hidden="true">
            {startIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          className={classNames}
          aria-invalid={hasError || undefined}
          {...rest}
        />
        {endAdornment ? (
          <span className={styles.endAdornment}>{endAdornment}</span>
        ) : null}
      </div>
    );
  }
);
