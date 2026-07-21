import { z } from "zod";

/**
 * Server-only environment schema.
 *
 * Bu fayl YALNIZ server tərəfli kodda import edilməlidir (Server Components,
 * Route Handlers, Server Actions). Client komponentlərində import edilməsi
 * build zamanı xəta yaradacaq, çünki burada məxfi dəyərlər saxlanılır.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),

  API_BASE_URL: z.string().url().optional(),
  API_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),

  /**
   * Tətbiqin data mənbəyi rejimi.
   *  - "mock": Bütün servislər statik mock datadan istifadə edir.
   *  - "api": Servislər real backend API-yə qoşulur.
   * Servislər bu dəyəri birbaşa yoxlamamalı, `getDataSourceMode()`
   * funksiyası vasitəsilə mərkəzləşdirilmiş şəkildə oxumalıdır.
   */
  APP_DATA: z.enum(["mock", "api"]).default("mock"),

  AUTH_SECRET: z.string().min(1, "AUTH_SECRET tələb olunur"),
  AUTH_SESSION_MAX_AGE: z.coerce.number().int().positive().default(28800),
  AUTH_COOKIE_NAME: z.string().default("aptr_session"),

  LOGIN_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  LOGIN_LOCKOUT_MINUTES: z.coerce.number().int().positive().default(15),

  LOG_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .default("info"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function loadServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Mühit dəyişənləri düzgün konfiqurasiya edilməyib:\n${formatted}`
    );
  }

  return parsed.data;
}

let cachedServerEnv: ServerEnv | undefined;

/**
 * Validasiya olunmuş server mühit dəyişənlərini qaytarır.
 * Nəticə keşlənir ki, hər çağırışda təkrar validasiya aparılmasın.
 */
export function getServerEnv(): ServerEnv {
  if (!cachedServerEnv) {
    cachedServerEnv = loadServerEnv();
  }

  return cachedServerEnv;
}
