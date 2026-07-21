import { getClientEnv } from "@/lib/env/client";

/**
 * Bütün tətbiq boyu istifadə olunan statik sayt konfiqurasiyası.
 * Genişləndirilə bilər: yeni sahələr əlavə etmək üçün bu faylı yeniləyin.
 */
export function getSiteConfig() {
  const env = getClientEnv();

  return {
    appName: env.NEXT_PUBLIC_APP_NAME,
    appShortName: env.NEXT_PUBLIC_APP_SHORT_NAME,
    departmentName:
      "Dövlət əmlakının özəlləşdirilməsinin təşkili şöbəsi",
    defaultLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
    supportedLocales: env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(","),
    logo: {
      src: "/images/logo.png",
      alt: "Dövlət Əmlakının Özəlləşdirilməsinin Təşkili Şöbəsinin rəsmi loqosu",
      width: 88,
      height: 88,
    },
  } as const;
}

export type SiteConfig = ReturnType<typeof getSiteConfig>;
