# Admin Panel — Gələcək API Endpoint-ləri

Bu sənəd Admin Panel-in hazırkı **Mock Data** mərhələsində istifadə olunan
hər bir funksiya üçün gələcəkdə əvəz ediləcək real API endpoint-lərini
sənədləşdirir. `APP_DATA=api` rejiminə keçid zamanı bu cədvəldəki hər sətir
uyğun `services/providers/api-*.provider.ts` faylında tətbiq edilməlidir.

> **Vacib qeyd — Mock persistensiya:** Hazırda bütün cədvəl datası
> `src/lib/mock-db/data/admin-tables.json` faylında, real fayl sistemi
> yazıları (`fs/promises`) ilə saxlanılır. Bu, YALNIZ davamlı/yazıla bilən
> fayl sisteminə malik mühitlərdə (`next dev`, öz serverində `next start`)
> işləyir. Serverless/edge platformalarda (məsələn Vercel, Cloudflare
> Workers) fayl yazıları davamlı olmur — bu tip mühitlərə keçiddə
> aşağıdakı bütün endpoint-lər tətbiq olunmalı və `APP_DATA=api`
> seçilməlidir.

## 1. Admin autentifikasiyası

Fayl: `src/features/admin-auth/services/admin-auth.service.ts`

| Əməliyyat | Hazırkı mock funksiya | Gələcək endpoint | Request | Response |
|---|---|---|---|---|
| Admin girişi | `loginAsAdmin()` | `POST /api/admin/auth/login` | `{ username, password }` | `{ success, session?: { username }, message? }` |
| Admin çıxışı | `destroyAdminSession()` | `POST /api/admin/auth/logout` | — (cookie/token vasitəsilə) | `{ success }` |
| Sessiya yoxlanışı | `getCurrentAdmin()` | `GET /api/admin/auth/me` | — | `{ session: { username } \| null }` |

> Hazırkı sessiya imzalanmamış JSON cookie-dir (`aptr_admin_session`).
> Real backend hazır olduqda bu, imzalanmış JWT və ya server-side sessiya
> ilə əvəz olunmalıdır.

## 2. Cədvəl strukturu (Generic Dynamic Table)

Fayl: `src/features/admin-tables/services/providers/api-admin-table.provider.ts`
(bütün funksiyalar hazırda placeholder olaraq xəta atır)

| Əməliyyat | Mock funksiya | Gələcək endpoint | Request | Response |
|---|---|---|---|---|
| Slug zənciri ilə cədvəl tapmaq | `resolveTableByPathWithMockProvider(path)` | `GET /api/admin/tables/resolve?path=muessiseler/muessise-haqqinda` | query: slug path | `{ table, breadcrumbs, path } \| null` |
| Root cədvəllərin siyahısı | `getRootTablesWithMockProvider()` | `GET /api/admin/tables/roots` | — | `AdminTable[]` |
| Sətir+sütuna (hüceyrəyə) görə qruplaşdırılmış alt cədvəllər | `getChildTablesByCellWithMockProvider(tableId)` | `GET /api/admin/tables/:tableId/children-by-cell` | — | `Record<rowId, Record<columnId, ChildTableSummary[]>>` |
| Sütun əlavə etmək | `addColumnWithMockProvider()` | `POST /api/admin/tables/:tableId/columns` | `{ label, type }` | `AdminTable` |
| Sütun adını dəyişmək | `renameColumnWithMockProvider()` | `PATCH /api/admin/tables/:tableId/columns/:columnId` | `{ label }` | `AdminTable` |
| Sütunu silmək | `deleteColumnWithMockProvider()` | `DELETE /api/admin/tables/:tableId/columns/:columnId` | — | `AdminTable` |
| Sətir əlavə etmək | `addRowWithMockProvider()` | `POST /api/admin/tables/:tableId/rows` | — | `AdminTable` |
| Hüceyrə dəyərini yeniləmək | `updateCellWithMockProvider()` | `PATCH /api/admin/tables/:tableId/rows/:rowId/cells/:columnId` | `{ value }` | `AdminTable` |
| Sətri silmək (kaskad) | `deleteRowWithMockProvider()` | `DELETE /api/admin/tables/:tableId/rows/:rowId` | — | `AdminTable` |
| Cədvəl başlığını dəyişmək | `renameTableWithMockProvider()` | `PATCH /api/admin/tables/:tableId` | `{ title }` | `AdminTable` |
| Sətrin bir hüceyrəsinə bağlı alt cədvəl yaratmaq | `createSubTableWithMockProvider()` | `POST /api/admin/tables/:tableId/rows/:rowId/sub-tables` | `{ columnId, title }` | `{ childTable: AdminTable }` |
| Alt cədvəli (və nəvələrini) silmək | `deleteSubTableWithMockProvider()` | `DELETE /api/admin/tables/:parentTableId/sub-tables/:childTableId` | — | `{ success: true }` |

### Data modeli (kontrakt dəyişməməlidir)

```ts
interface AdminColumn {
  id: string;
  key: string;
  label: string;
  type: "text" | "link" | "file";
  order: number;
}

interface AdminRow {
  id: string;
  values: Record<string, string>; // sütun key -> dəyər
  createdAt: string;
  updatedAt: string;
}

interface AdminTable {
  id: string;
  slug: string;
  title: string;
  description?: string;
  columns: AdminColumn[];
  rows: AdminRow[];
  parentTableId: string | null;
  parentRowId: string | null;
  // Bu cədvəlin valideyn sətrində hansı KONKRET hüceyrəyə (sütuna) bağlı
  // olduğu; root üçün `null`. Alt cədvəl bütöv sətrə deyil, sətrin müəyyən
  // bir data xanasına bağlanır.
  parentCellColumnId: string | null;
  createdAt: string;
  updatedAt: string;
}
```

Bu tiplər `src/features/admin-tables/types/index.ts` faylında təsvir
olunub. API inteqrasiyası zamanı backend cavabı məhz bu formaya uyğun
olmalıdır ki, çağıran kodda (komponentlər, hook) heç bir dəyişiklik
lazım olmasın.

## 3. Fayl/Şəkil yükləmə (placeholder)

Hazırda **heç bir upload funksiyası yazılmayıb**. `AdminColumn.type === "file"`
olan sütunlar UI-da deaktiv "Fayl yüklə (tezliklə)" düyməsi ilə göstərilir
(bax `src/features/admin-tables/components/EditableCell`).

Gələcəkdə real yükləmə üçün planlaşdırılan endpoint:

| Əməliyyat | Gələcək endpoint | Request | Response |
|---|---|---|---|
| Fayl yükləmək | `POST /api/admin/files` | `multipart/form-data` (`file`, `tableId`, `rowId`, `columnId`) | `{ fileUrl, fileName, mimeType, sizeBytes }` |
| Fayl silmək | `DELETE /api/admin/files/:fileId` | — | `{ success }` |

Yüklənmiş faylın URL-i hüceyrə dəyəri (`AdminRow.values[columnKey]`) kimi
saxlanılacaq — data modelində əlavə dəyişiklik tələb olunmur.

## 4. Data mənbəyi keçidi

Bütün provayderlər `getDataSourceMode()` (`src/lib/data-source`) vasitəsilə
seçilir. `APP_DATA=api` mühit dəyişəni ilə mock provayderlərdən real API
provayderlərinə keçid tək bir nöqtədən idarə olunur — çağıran servis/action
kodunda heç bir dəyişiklik tələb olunmur.
