"use client";

import { useEffect, useRef, useState } from "react";
import type { AuthenticatedUser } from "@/features/auth/types";
import { logoutAction } from "@/features/auth/actions/logout.action";
import styles from "./UserMenu.module.css";

export interface UserMenuProps {
  user: AuthenticatedUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className={styles.avatar} aria-hidden="true">
          <UserIcon size={18} />
        </span>
        <span className={styles.fullName}>{user.fullName}</span>
        <ChevronIcon className={isOpen ? styles.chevronOpen : ""} />
      </button>

      {isOpen ? (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownAvatar} aria-hidden="true">
              <UserIcon size={22} />
            </span>
            <div className={styles.dropdownInfo}>
              <span className={styles.dropdownName}>{user.fullName}</span>
            </div>
          </div>
          <div className={styles.dropdownDivider} />
          <button
            type="button"
            className={styles.logoutButton}
            role="menuitem"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogoutIcon />
            {isLoggingOut ? "Çıxış edilir..." : "Çıxış"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function UserIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 20.25c0-3.728 3.582-6.75 8-6.75s8 3.022 8 6.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 16 20 12l-4.5-4M20 12H9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
