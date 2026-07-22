import type { Enterprise } from "../types";

/**
 * "Müəssisələr" cədvəli üçün nümunə (boş) sətirlər.
 *
 * QEYD: Bu fayl YALNIZ UI dizaynını nümayiş etdirmək üçündür. Backend
 * inteqrasiyası zamanı bu mock məlumatlar real servis çağırışı ilə
 * əvəz olunacaq.
 */
export const MOCK_ENTERPRISES: Enterprise[] = Array.from(
  { length: 8 },
  (_, index) => ({
    id: `enterprise-${index + 1}`,
    serialNumber: index + 1,
    name: "",
    location: "",
    address: "",
    taxId: "",
    previousParentCompany: "",
    charterCapital: "",
    landArea: "",
    buildingArea: "",
    privatizationDate: "",
    investorInfo: "",
    currentStatusAndIssues: "",
    investmentCommitmentsAndStatus: "",
  }),
);
