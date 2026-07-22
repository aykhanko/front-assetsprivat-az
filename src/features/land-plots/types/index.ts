/**
 * "Torpaq sahələri" (Land Plots) modulunun tip təsviri.
 *
 * QEYD: Bu mərhələdə yalnız UI hazırlanır, buna görə sahələr sətir (string)
 * kimi saxlanılır. Backend inteqrasiyası zamanı uyğun tiplərə (Date, number
 * və s.) çevrilə bilər.
 */
export interface LandPlot {
  id: string;
  /** S/S — sıra nömrəsi */
  serialNumber: number;
  objectName: string;
  address: string;
  leaseAgreementNumberAndDate: string;
  ownerInfo: string;
  ownershipDocumentNumberAndDate: string;
  documentedLandArea: string;
  actualLandArea: string;
  pricePerSotka: string;
  totalLandPrice: string;
  ownershipType: string;
  initialPrivatizationName: string;
  activityType: string;
  zone: string;
  category: string;
  protectionZone: string;
  objectDescription: string;
  currentStatus: string;
  note: string;
}
