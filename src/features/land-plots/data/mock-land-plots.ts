import type { LandPlot } from "../types";

/**
 * "Torpaq sahələri" cədvəli üçün nümunə (boş) sətirlər.
 *
 * QEYD: Bu fayl YALNIZ UI dizaynını nümayiş etdirmək üçündür. Backend
 * inteqrasiyası zamanı bu mock məlumatlar real servis çağırışı ilə
 * əvəz olunacaq.
 */
export const MOCK_LAND_PLOTS: LandPlot[] = Array.from(
  { length: 8 },
  (_, index) => ({
    id: `land-plot-${index + 1}`,
    serialNumber: index + 1,
    objectName: "",
    address: "",
    leaseAgreementNumberAndDate: "",
    ownerInfo: "",
    ownershipDocumentNumberAndDate: "",
    documentedLandArea: "",
    actualLandArea: "",
    pricePerSotka: "",
    totalLandPrice: "",
    ownershipType: "",
    initialPrivatizationName: "",
    activityType: "",
    zone: "",
    category: "",
    protectionZone: "",
    objectDescription: "",
    currentStatus: "",
    note: "",
  }),
);
