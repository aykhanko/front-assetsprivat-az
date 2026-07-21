import type { DashboardModule } from "../types";

/**
 * Ana səhifədə göstərilən modul kartlarının mock siyahısı.
 *
 * QEYD: Bu fayl YALNIZ `APP_DATA=mock` rejimində istifadə olunur.
 * `APP_DATA=api` rejiminə keçdikdə bu strukturun eynisi backend
 * cavabından formalaşdırılacaq (bax: `services/providers/api-dashboard.provider.ts`).
 */
export const MOCK_DASHBOARD_MODULES: DashboardModule[] = [
  {
    id: "enterprises",
    title: "Müəssisələr",
    description: "Özəlləşdirilən müəssisələr üzrə məlumatların idarə edilməsi",
    icon: "enterprise",
    href: "/dashboard/enterprises",
    isEnabled: false,
  },
  {
    id: "property-complexes",
    title: "Əmlak kompleksləri",
    description: "Əmlak kompleksləri üzrə status və uçot məlumatları",
    icon: "complex",
    href: "/dashboard/property-complexes",
    isEnabled: false,
  },
  {
    id: "land-plots",
    title: "Torpaq sahələri",
    description: "Torpaq sahələrinin özəlləşdirilməsi üzrə qeydiyyat",
    icon: "land",
    href: "/dashboard/land-plots",
    isEnabled: false,
  },
  {
    id: "orders-and-decrees",
    title: "Əmr və Sərəncamlar",
    description: "Rəsmi əmr və sərəncamların elektron reyestri",
    icon: "order",
    href: "/dashboard/orders-and-decrees",
    isEnabled: false,
  },
];
