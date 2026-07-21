import { MOCK_DASHBOARD_MODULES } from "../../data/mock-modules";
import type { DashboardModule } from "../../types";

export async function getModulesFromMockProvider(): Promise<
  DashboardModule[]
> {
  return MOCK_DASHBOARD_MODULES;
}
