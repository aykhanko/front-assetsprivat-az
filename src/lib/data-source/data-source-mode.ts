import { getServerEnv } from "@/lib/env/server";

export type DataSourceMode = "mock" | "api";

/**
 * Bütün "feature" servisləri data mənbəyini (mock və ya real API) müəyyən
 * etmək üçün YALNIZ bu funksiyadan istifadə etməlidir. Bu, `APP_DATA`
 * mühit dəyişəninin oxunma məntiqini bir yerdə saxlayır və gələcəkdə
 * mock -> api keçidini tək bir nöqtədən idarə etməyə imkan verir.
 */
export function getDataSourceMode(): DataSourceMode {
  return getServerEnv().APP_DATA;
}

export function isMockDataSource(): boolean {
  return getDataSourceMode() === "mock";
}
