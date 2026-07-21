import { z } from "zod";

/**
 * Client-safe environment schema.
 *
 * Bura YALNIZ "NEXT_PUBLIC_" prefiksli dəyişənlər əlavə edilməlidir, çünki
 * bu modul brauzer tərəfli kodda da import edilə bilər.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .default("Dövlət Əmlakının Özəlləşdirilməsinin Təşkili Şöbəsi"),
  NEXT_PUBLIC_APP_SHORT_NAME: z.string().default("Əmlak İdarəetmə Sistemi"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("az"),
  NEXT_PUBLIC_SUPPORTED_LOCALES: z.string().default("az,en,ru"),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

function loadClientEnv(): ClientEnv {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_SHORT_NAME: process.env.NEXT_PUBLIC_APP_SHORT_NAME,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    NEXT_PUBLIC_SUPPORTED_LOCALES: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  });

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Client mühit dəyişənləri düzgün konfiqurasiya edilməyib:\n${formatted}`
    );
  }

  return parsed.data;
}

let cachedClientEnv: ClientEnv | undefined;

export function getClientEnv(): ClientEnv {
  if (!cachedClientEnv) {
    cachedClientEnv = loadClientEnv();
  }

  return cachedClientEnv;
}
