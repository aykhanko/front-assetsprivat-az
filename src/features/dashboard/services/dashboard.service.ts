import { getDataSourceMode } from "@/lib/data-source";
import type { DashboardModule } from "../types";
import { getModulesFromMockProvider } from "./providers/mock-dashboard.provider";
import { getModulesFromApiProvider } from "./providers/api-dashboard.provider";

/**
 * Ana səhifə modullarını `APP_DATA` rejiminə uyğun mənbədən qaytarır.
 * Çağıran kod provayder detalları ilə maraqlanmır — `APP_DATA=api`-ə
 * keçid zamanı bu funksiyanın imzası dəyişməz qalır.
 */
export async function getDashboardModules(): Promise<DashboardModule[]> {
  const mode = getDataSourceMode();

  if (mode === "api") {
    return getModulesFromApiProvider();
  }

  return getModulesFromMockProvider();
}
