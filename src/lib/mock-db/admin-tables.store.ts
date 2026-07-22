import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { buildSeedAdminTables } from "@/features/admin-tables/data/seed-admin-tables";
import type { AdminTable } from "@/features/admin-tables/types";

/**
 * Mock "verilənlər bazası" — Admin Panel-in bütün cədvəl datası bu JSON
 * faylda saxlanılır və `fs/promises` ilə real şəkildə oxunub yazılır.
 *
 * QEYD: Bu yanaşma YALNIZ yazıla bilən fayl sisteminə malik mühitlərdə
 * (`next dev`, öz serverində `next start`) işləyir. Serverless/edge
 * platformalarda (məs. Vercel) fayl yazıları davamlı olmur — bu hallarda
 * `APP_DATA=api` rejiminə keçid tələb olunur (bax `docs/admin-panel-api.md`).
 */
const DATA_FILE_PATH = path.join(
  process.cwd(),
  "src/lib/mock-db/data/admin-tables.json"
);

async function readFromDisk(): Promise<AdminTable[] | null> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as AdminTable[];
    }

    return null;
  } catch {
    return null;
  }
}

async function persist(tables: AdminTable[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
  await fs.writeFile(
    DATA_FILE_PATH,
    `${JSON.stringify(tables, null, 2)}\n`,
    "utf-8"
  );
}

async function loadOrSeed(): Promise<AdminTable[]> {
  const existing = await readFromDisk();

  if (existing) {
    return existing;
  }

  const seeded = buildSeedAdminTables();
  await persist(seeded);
  return seeded;
}

/**
 * Bütün oxuma/yazma əməliyyatları bu növbə üzərindən ardıcıl icra olunur.
 * Bu, paralel Server Action çağırışlarının JSON faylı üzərində
 * "read-modify-write" yarışına (race condition) düşməsinin qarşısını alır.
 */
let taskQueue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = taskQueue.then(task);
  taskQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

export async function readAdminTables(): Promise<AdminTable[]> {
  return enqueue(() => loadOrSeed());
}

export async function mutateAdminTables(
  mutator: (tables: AdminTable[]) => AdminTable[]
): Promise<AdminTable[]> {
  return enqueue(async () => {
    const current = await loadOrSeed();
    const next = mutator(current);
    await persist(next);
    return next;
  });
}
