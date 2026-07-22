"use client";

import { useState } from "react";
import Link from "next/link";
import { adminLogoutAction } from "../../actions/admin-logout.action";
import type { AdminSession } from "../../types";
import styles from "./AdminTopBar.module.css";

export interface AdminTopBarProps {
  admin: AdminSession;
}

export function AdminTopBar({ admin }: AdminTopBarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await adminLogoutAction();
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.inner}>
        <Link href="/admin" className={styles.brand}>
          Admin Panel
        </Link>
        <div className={styles.actions}>
          <span className={styles.username}>{admin.username}</span>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Çıxış edilir..." : "Çıxış"}
          </button>
        </div>
      </div>
    </header>
  );
}
