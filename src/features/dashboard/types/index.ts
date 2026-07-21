export interface DashboardModule {
  id: string;
  title: string;
  description: string;
  icon: DashboardModuleIcon;
  href: string;
  isEnabled: boolean;
}

export type DashboardModuleIcon =
  | "enterprise"
  | "complex"
  | "land"
  | "order";
