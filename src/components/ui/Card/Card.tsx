import { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...rest }: CardProps) {
  const classNames = [styles.card, className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
}
