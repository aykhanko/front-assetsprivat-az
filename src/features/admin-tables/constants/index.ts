export interface RootTableDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
}

/**
 * Admin Panel-in 3 sabit bölməsi (root cədvəllər). Bunlardan başqa bütün
 * cədvəllər (alt cədvəllər) admin tərəfindən dinamik yaradılır.
 */
export const ROOT_TABLE_DEFINITIONS: RootTableDefinition[] = [
  {
    id: "root-enterprises",
    slug: "muessiseler",
    title: "Müəssisələr",
    description: "Özəlləşdirilən müəssisələr üzrə məlumatların idarə edilməsi",
  },
  {
    id: "root-property-complexes",
    slug: "emlak-kompleksleri",
    title: "Əmlak kompleksləri",
    description: "Əmlak kompleksləri üzrə status və uçot məlumatları",
  },
  {
    id: "root-land-plots",
    slug: "torpaq-saheleri",
    title: "Torpaq sahələri",
    description: "Torpaq sahələrinin özəlləşdirilməsi üzrə qeydiyyat",
  },
];

/**
 * `/dashboard/*` görüntüləmə səhifələrinin öz (ingilis dilində, tarixi)
 * URL seqmentlərini müvafiq admin root cədvəlinin slug-una uyğunlaşdırır.
 * Bu sayədə `/dashboard` marşrutları dəyişmədən qalır, amma daxildə eyni
 * canlı admin datasını oxuyur.
 */
export const DASHBOARD_ROOT_SLUG_TO_ADMIN_SLUG: Record<string, string> = {
  enterprises: "muessiseler",
  "property-complexes": "emlak-kompleksleri",
  "land-plots": "torpaq-saheleri",
};

export const MAX_COLUMN_LABEL_LENGTH = 120;
export const MAX_TABLE_TITLE_LENGTH = 160;
export const MAX_CELL_VALUE_LENGTH = 10000;

export const ADMIN_SESSION_COOKIE_NAME = "aptr_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 28800;
