/**
 * Generic Dynamic Table sisteminin əsas tip təsvirləri.
 *
 * Hər cədvəl (root və ya alt cədvəl) eyni formaya malikdir: sütunlar
 * (`columns`) və sətirlər (`rows`) tamamilə dinamikdir, koda hardcode
 * edilməyib. `parentTableId` / `parentRowId` cədvəllər arasında
 * ağac (tree) strukturunu təmin edir.
 */
export type AdminColumnType = "text" | "link" | "file";

export interface AdminColumn {
  id: string;
  /** Sətir dəyərlərində (`AdminRow.values`) istifadə olunan sabit açar. */
  key: string;
  label: string;
  type: AdminColumnType;
  order: number;
}

export interface AdminRow {
  id: string;
  /** Sütun `key`-i -> hüceyrə dəyəri (həmişə string, UI tərəfindən formatlanır). */
  values: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTable {
  id: string;
  slug: string;
  title: string;
  description?: string;
  columns: AdminColumn[];
  rows: AdminRow[];
  /** Root cədvəllər üçün `null`. */
  parentTableId: string | null;
  /** Bu cədvəlin hansı valideyn sətrinə bağlı olduğu; root üçün `null`. */
  parentRowId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTableBreadcrumb {
  id: string;
  slug: string;
  title: string;
}

export interface ResolvedAdminTable {
  table: AdminTable;
  breadcrumbs: AdminTableBreadcrumb[];
  path: string[];
}

/** Bir sətrə bağlı alt cədvəllərin yüngül (link üçün kifayət edən) forması. */
export interface ChildTableSummary {
  id: string;
  slug: string;
  title: string;
}
