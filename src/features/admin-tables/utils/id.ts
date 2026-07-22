/**
 * Mock qat üçün unikal ID generatoru. Real API-yə keçiddə ID-lər backend
 * tərəfindən veriləcək — bu funksiya YALNIZ mock provayderdə istifadə olunur.
 */
export function generateId(prefix?: string): string {
  const id = crypto.randomUUID();
  return prefix ? `${prefix}-${id}` : id;
}
