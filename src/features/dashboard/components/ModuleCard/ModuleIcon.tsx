import type { DashboardModuleIcon } from "../../types";

export interface ModuleIconProps {
  name: DashboardModuleIcon;
}

export function ModuleIcon({ name }: ModuleIconProps) {
  switch (name) {
    case "enterprise":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 20.5V9.75L11 5l7 4.75v10.75"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 20.5v-6h5v6M4 20.5h14.5"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M11 9h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "complex":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="3.5" y="9" width="6" height="11.5" stroke="currentColor" strokeWidth="1.6" />
          <rect x="10.5" y="4.5" width="6" height="16" stroke="currentColor" strokeWidth="1.6" />
          <rect x="17.5" y="11.5" width="3.5" height="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12.5 8h2M12.5 11h2M12.5 14h2" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "land":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 15.5 9 5.5l4.5 6.5L16 8l5 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M2.5 20.5h19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "order":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="3.5" width="14" height="17" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8 8h8M8 11.5h8M8 15h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}
