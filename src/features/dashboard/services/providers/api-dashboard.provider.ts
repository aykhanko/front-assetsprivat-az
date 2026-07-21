import { getServerEnv } from "@/lib/env/server";
import type { DashboardModule } from "../../types";

/**
 * Real API provayderi. `APP_DATA=api` olduqda istifadə olunacaq.
 * Backend endpoint-i hazır olduqda URL və cavab strukturunu təsdiqləyin.
 */
export async function getModulesFromApiProvider(): Promise<
  DashboardModule[]
> {
  const env = getServerEnv();

  if (!env.API_BASE_URL) {
    return [];
  }

  const response = await fetch(`${env.API_BASE_URL}/dashboard/modules`, {
    signal: AbortSignal.timeout(env.API_TIMEOUT_MS),
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}
