import Image from "next/image";
import { getSiteConfig } from "@/config/site";
import type { AuthenticatedUser } from "@/features/auth/types";
import { UserMenu } from "../UserMenu";
import styles from "./AppTopBar.module.css";

export interface AppTopBarProps {
  user: AuthenticatedUser | null;
}

export function AppTopBar({ user }: AppTopBarProps) {
  const site = getSiteConfig();

  return (
    <header className={styles.topBar}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src={site.logo.src}
            alt={site.logo.alt}
            width={40}
            height={40}
            className={styles.logo}
          />
          <div className={styles.brandText}>
            <span className={styles.departmentName}>
              {site.departmentName}
            </span>
          </div>
        </div>

        {user ? <UserMenu user={user} /> : null}
      </div>
    </header>
  );
}
