/**
 * "Əmlak kompleksləri" (Property Complexes) modulunun tip təsvirləri.
 *
 * QEYD: Bu mərhələdə yalnız UI hazırlanır, buna görə sahələr sətir (string)
 * kimi saxlanılır. Backend inteqrasiyası zamanı uyğun tiplərə (Date, number
 * və s.) çevrilə bilər.
 */
export interface PropertyComplex {
  id: string;
  /** S.N — sıra nömrəsi */
  serialNumber: number;
  name: string;
  location: string;
  address: string;
  taxId: string;
  previousParentCompany: string;
  charterCapital: string;
  landArea: string;
  buildingArea: string;
  privatizationDate: string;
  investorInfo: string;
  currentStatusAndIssues: string;
  investmentCommitmentsAndStatus: string;
}
