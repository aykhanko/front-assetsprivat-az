import { MOCK_ENTERPRISES } from "@/features/enterprises/data/mock-enterprises";
import { MOCK_PROPERTY_COMPLEXES } from "@/features/property-complexes/data/mock-property-complexes";
import { MOCK_LAND_PLOTS } from "@/features/land-plots/data/mock-land-plots";
import { ROOT_TABLE_DEFINITIONS } from "../constants";
import type { AdminColumn, AdminRow, AdminTable } from "../types";

/**
 * Admin Panel-in ilkin (seed) məlumatları.
 *
 * QEYD: Bu fayl YALNIZ mock JSON store boş olduqda bir dəfə istifadə olunur
 * (bax `src/lib/mock-db/admin-tables.store.ts`). Sütun/sətir siyahısı
 * `/dashboard/*` görüntüləmə səhifələrində artıq mövcud olan sütun və
 * nümunə datalarla uzlaşdırılıb ki, Admin Panel işə düşəndə eyni struktur
 * görünsün.
 */
const SEED_TIMESTAMP = "2026-01-01T00:00:00.000Z";

function buildColumn(
  key: string,
  label: string,
  order: number,
  type: AdminColumn["type"] = "text"
): AdminColumn {
  return { id: `col-${key}`, key, label, type, order };
}

function buildRow(id: string, values: Record<string, string>): AdminRow {
  return { id, values, createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP };
}

function buildRootTable(
  definitionIndex: number,
  columns: AdminColumn[],
  rows: AdminRow[]
): AdminTable {
  const definition = ROOT_TABLE_DEFINITIONS[definitionIndex];

  return {
    id: definition.id,
    slug: definition.slug,
    title: definition.title,
    description: definition.description,
    columns,
    rows,
    parentTableId: null,
    parentRowId: null,
    parentCellColumnId: null,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  };
}

/* ------------------------------------------------------------------------ */
/* Müəssisələr                                                              */
/* ------------------------------------------------------------------------ */
const ENTERPRISE_COLUMNS: AdminColumn[] = [
  buildColumn("name", "Daşınmaz əmlakın adı", 0, "link"),
  buildColumn("location", "Yerləşdiyi ərazi", 1),
  buildColumn("address", "Ünvanı", 2),
  buildColumn("taxId", "VÖEN", 3),
  buildColumn("previousParentCompany", "Əvvəlki tabeçi müəssisə adı", 4),
  buildColumn("charterCapital", "Nizamnamə kapitalı", 5),
  buildColumn("landArea", "Torpaq sahəsi", 6),
  buildColumn("buildingArea", "Tikililərin sahəsi", 7),
  buildColumn("privatizationDate", "Özəlləşdirilmə tarixi", 8),
  buildColumn("investorInfo", "İnvestor haqqında məlumatlar", 9, "link"),
  buildColumn(
    "currentStatusAndIssues",
    "Müəssisənin mövcud vəziyyəti və problemləri",
    10,
    "link"
  ),
  buildColumn("mapLink", "Məkana get", 11, "link"),
  buildColumn(
    "investmentCommitmentsAndStatus",
    "İnvestisiya öhdəlikləri və hazırki vəziyyət",
    12,
    "link"
  ),
];

function buildEnterpriseRows(): AdminRow[] {
  return MOCK_ENTERPRISES.map((enterprise) =>
    buildRow(enterprise.id, {
      name: enterprise.name,
      location: enterprise.location,
      address: enterprise.address,
      taxId: enterprise.taxId,
      previousParentCompany: enterprise.previousParentCompany,
      charterCapital: enterprise.charterCapital,
      landArea: enterprise.landArea,
      buildingArea: enterprise.buildingArea,
      privatizationDate: enterprise.privatizationDate,
      investorInfo: enterprise.investorInfo,
      currentStatusAndIssues: enterprise.currentStatusAndIssues,
      mapLink: "Google xəritəyə get",
      investmentCommitmentsAndStatus: enterprise.investmentCommitmentsAndStatus,
    })
  );
}

/* ------------------------------------------------------------------------ */
/* Əmlak kompleksləri                                                       */
/* ------------------------------------------------------------------------ */
const PROPERTY_COMPLEX_COLUMNS: AdminColumn[] = [
  buildColumn("name", "Daşınmaz əmlakın adı", 0, "link"),
  buildColumn("location", "Yerləşdiyi ərazi", 1),
  buildColumn("address", "Ünvanı", 2),
  buildColumn("taxId", "VÖEN", 3),
  buildColumn("previousParentCompany", "Əvvəlki tabeçi müəssisə adı", 4),
  buildColumn("charterCapital", "Nizamnamə kapitalı", 5),
  buildColumn("landArea", "Torpaq sahəsi", 6),
  buildColumn("buildingArea", "Tikililərin sahəsi", 7),
  buildColumn("privatizationDate", "Özəlləşdirilmə tarixi", 8),
  buildColumn("investorInfo", "İnvestor haqqında məlumatlar", 9, "link"),
  buildColumn(
    "currentStatusAndIssues",
    "Kompleksin mövcud vəziyyəti və problemləri",
    10,
    "link"
  ),
  buildColumn("mapLink", "Məkana get", 11, "link"),
  buildColumn(
    "investmentCommitmentsAndStatus",
    "İnvestisiya öhdəlikləri və hazırki vəziyyət",
    12,
    "link"
  ),
];

function buildPropertyComplexRows(): AdminRow[] {
  return MOCK_PROPERTY_COMPLEXES.map((complex) =>
    buildRow(complex.id, {
      name: complex.name,
      location: complex.location,
      address: complex.address,
      taxId: complex.taxId,
      previousParentCompany: complex.previousParentCompany,
      charterCapital: complex.charterCapital,
      landArea: complex.landArea,
      buildingArea: complex.buildingArea,
      privatizationDate: complex.privatizationDate,
      investorInfo: complex.investorInfo,
      currentStatusAndIssues: complex.currentStatusAndIssues,
      mapLink: "Google xəritəyə get",
      investmentCommitmentsAndStatus: complex.investmentCommitmentsAndStatus,
    })
  );
}

/* ------------------------------------------------------------------------ */
/* Torpaq sahələri                                                          */
/* ------------------------------------------------------------------------ */
const LAND_PLOT_COLUMNS: AdminColumn[] = [
  buildColumn("objectName", "Obyektin adı", 0, "link"),
  buildColumn("address", "Ünvanı", 1, "link"),
  buildColumn(
    "leaseAgreementNumberAndDate",
    "İcarə müqaviləsinin nömrəsi və tarixi",
    2
  ),
  buildColumn("ownerInfo", "Mülkiyyətçi haqqında məlumat", 3),
  buildColumn(
    "ownershipDocumentNumberAndDate",
    "Mülkiyyət hüququnu təsdiq edilməsinə dair sənədin nömrəsi və tarixi",
    4
  ),
  buildColumn("documentedLandArea", "Sənəd üzrə torpaq sahəsi (ha)", 5),
  buildColumn("actualLandArea", "Torpağın faktiki sahəsi (ha)", 6),
  buildColumn(
    "pricePerSotka",
    "Torpaq sahəsinin 1 sotunun qiyməti (manat)",
    7
  ),
  buildColumn(
    "totalLandPrice",
    "Torpaq sahəsinin ümumi qiyməti (manat)",
    8
  ),
  buildColumn("ownershipType", "Dövlət və ya qeyri-dövlət", 9),
  buildColumn(
    "initialPrivatizationName",
    "Obyektin ilkin özəlləşmə anındakı adı",
    10
  ),
  buildColumn(
    "activityType",
    "Fəaliyyət növü (sağlıq evi, restoran, çayxana və s.)",
    11
  ),
  buildColumn("zone", "Zona", 12),
  buildColumn("category", "Kateqoriya", 13),
  buildColumn("protectionZone", "Mühafizə zonası", 14),
  buildColumn("objectDescription", "Obyektin təsviri", 15),
  buildColumn("currentStatus", "Cari statusu", 16),
  buildColumn(
    "note",
    "Qeyd (zəbt, sökülüb, park ərazisi, binanın bir hissəsi)",
    17
  ),
];

function buildLandPlotRows(): AdminRow[] {
  return MOCK_LAND_PLOTS.map((landPlot) =>
    buildRow(landPlot.id, {
      objectName: landPlot.objectName,
      address: landPlot.address,
      leaseAgreementNumberAndDate: landPlot.leaseAgreementNumberAndDate,
      ownerInfo: landPlot.ownerInfo,
      ownershipDocumentNumberAndDate:
        landPlot.ownershipDocumentNumberAndDate,
      documentedLandArea: landPlot.documentedLandArea,
      actualLandArea: landPlot.actualLandArea,
      pricePerSotka: landPlot.pricePerSotka,
      totalLandPrice: landPlot.totalLandPrice,
      ownershipType: landPlot.ownershipType,
      initialPrivatizationName: landPlot.initialPrivatizationName,
      activityType: landPlot.activityType,
      zone: landPlot.zone,
      category: landPlot.category,
      protectionZone: landPlot.protectionZone,
      objectDescription: landPlot.objectDescription,
      currentStatus: landPlot.currentStatus,
      note: landPlot.note,
    })
  );
}

export function buildSeedAdminTables(): AdminTable[] {
  return [
    buildRootTable(0, ENTERPRISE_COLUMNS, buildEnterpriseRows()),
    buildRootTable(1, PROPERTY_COMPLEX_COLUMNS, buildPropertyComplexRows()),
    buildRootTable(2, LAND_PLOT_COLUMNS, buildLandPlotRows()),
  ];
}
