/**
 * Azərbaycan hərflərini latın transliterasiyasına çevirən slug generatoru.
 * Cədvəl/sütun başlıqlarından URL-uyğun slug yaratmaq üçün istifadə olunur.
 */
const AZ_TRANSLITERATION_MAP: Record<string, string> = {
  ə: "e",
  Ə: "e",
  ö: "o",
  Ö: "o",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  I: "i",
  ü: "u",
  Ü: "u",
  ş: "s",
  Ş: "s",
  ç: "c",
  Ç: "c",
};

function transliterate(input: string): string {
  return input
    .split("")
    .map((char) => AZ_TRANSLITERATION_MAP[char] ?? char)
    .join("");
}

export function slugify(input: string): string {
  const slug = transliterate(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "cedvel";
}

/** Sütun `key` dəyərləri üçün (obyekt açarı kimi istifadə olunacaq) slug. */
export function slugifyKey(input: string): string {
  return slugify(input).replace(/-/g, "_") || "sutun";
}

export function ensureUniqueSlug(
  baseSlug: string,
  existingSlugs: string[]
): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  let candidate = `${baseSlug}-${suffix}`;

  while (existingSlugs.includes(candidate)) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  return candidate;
}
