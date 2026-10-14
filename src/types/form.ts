export type SalesChannel = 'Toko Fisik Saja' | 'Toko Online Saja' | 'Toko Fisik dan Toko Online';

export type ApplicantRelation =
  | 'Pemilik usaha perseorangan'
  | 'Direktur/pengurus badan usaha yang berwenang'
  | 'Penerima kuasa dari pemilik atau pengurus yang berwenang';

export type BusinessType =
  | 'Usaha perseorangan'
  | 'Perseroan Terbatas (PT)'
  | 'Persekutuan Komanditer (CV)'
  | 'Koperasi'
  | 'Bentuk usaha lainnya';

export type OperatingStatus = 'Sudah beroperasi' | 'Belum beroperasi';
export type OnlineOperatingStatus = 'Sudah aktif' | 'Belum aktif';
export type ComplianceCheck = 'Ya' | 'Tidak' | 'Belum dapat memastikan';
export type PlatformComplianceCheck =
  | 'Ya, berdasarkan ketentuan platform yang berlaku'
  | 'Tidak'
  | 'Belum dapat memastikan';

export type PurchaseSource =
  | 'Distributor'
  | 'Pembelian langsung dari perusahaan'
  | 'Belum pernah melakukan pembelian';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'reviewing'
  | 'approved' // Dapat diajukan untuk persetujuan
  | 'continued' // Dapat dilanjutkan
  | 'on_hold' // Tahan permohonan
  | 'channel_rejected' // Tolak otorisasi untuk lokasi atau platform tersebut
  | 'rejected';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string; // Data URL / Base64 for preview & download
  uploadedAt: string;
}

export interface FormData {
  id: string;
  registrationNumber?: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number; // 1 to 9, or 10 for success
  status: ApplicationStatus;
  adminDecision?: string;
  adminNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;

  // Halaman 1: Info Pendaftaran
  acceptedGeneralInfo: boolean;

  // Halaman 2: Identitas Pemohon
  applicantName: string;
  applicantRelation: ApplicantRelation | '';
  applicantWhatsapp: string;
  applicantEmail: string;
  ownerName: string;
  ownerWhatsapp: string;
  ownerEmail: string;
  sameAsApplicant: boolean; // Helper toggle

  // Halaman 3: Identitas Usaha
  businessTradeName: string;
  businessType: BusinessType | '';
  businessTypeOther: string;
  businessLegalName: string;
  nibNumber: string;
  registeredAddress: string;
  city: string;
  province: string;

  // Halaman 4: Jenis Saluran Penjualan
  salesChannel: SalesChannel | '';

  // Halaman 5A: Toko Fisik Saja
  physicalStoreName: string;
  physicalStoreAddress: string;
  physicalStoreMapsUrl: string;
  physicalStorePicName: string;
  physicalStoreWhatsapp: string;
  physicalStoreOperatingStatus: OperatingStatus | '';
  physicalStoreCompliance: ComplianceCheck | '';

  // Halaman 5B: Toko Online Saja
  onlineStoreName: string;
  onlineStorePlatform: string;
  onlineStorePlatformOther: string;
  onlineStoreUrl: string;
  onlineStoreSellerId: string;
  onlineStoreAccountOwner: string;
  onlineStoreOperatingStatus: OnlineOperatingStatus | '';
  onlineStorePlatformCompliance: PlatformComplianceCheck | '';
  onlineStoreAgeVerification: ComplianceCheck | '';

  // Halaman 5C: Gabungan Toko Fisik dan Online (stored in same fields or separate copies)
  // For clarity and compatibility, we reuse physicalStore* and onlineStore* fields!

  // Halaman 6: Informasi Produk dan Distributor
  targetBrands: string[];
  otherBrandName: string;
  purchaseSource: PurchaseSource | '';
  distributorSupplierName: string;
  distributorCity: string;
  willingToProvideProof: 'Ya, bersedia' | 'Tidak bersedia' | '';

  // Halaman 7: Upload Dokumen
  docNib?: UploadedFile;
  docPhysicalStorePhoto?: UploadedFile;
  docOnlineStoreScreenshot?: UploadedFile;
  docPurchaseProof?: UploadedFile;
  docPowerOfAttorney?: UploadedFile;
  docBoardAuthority?: UploadedFile;

  // Halaman 8: Ketentuan Reseller dan Privasi
  agreeTerms: boolean;
  agreePrivacy: boolean;

  // Halaman 9: Pernyataan dan Konfirmasi Pemohon
  statementSignerName: string;
  statementTruth: boolean;
  statementVerificationConsent: boolean;
}

export type FormErrors = Partial<Record<keyof FormData | string, string>>;

export interface FormSettings {
  // General & Company
  companyName: string;
  companyTagline: string;
  companyAddress: string;
  companyPhone: string;
  complianceEmail: string;
  letterSignerName: string;
  letterSignerRole: string;

  // Form Availability & Prefix
  isRegistrationOpen: boolean;
  registrationClosedMessage: string;
  registrationPrefix: string;

  // Brands List (Page 6)
  brandsList: string[];
  allowOtherBrand: boolean;

  // Marketplaces / Platforms (Page 5B/5C)
  platformsList: string[];

  // Upload Requirements (Page 7)
  maxFileSizeMb: number;
  isPhysicalStorePhotoRequired: boolean;
  isPurchaseProofRequired: boolean;
  isPowerOfAttorneyRequired: boolean;

  // Content Customization
  formWelcomeTitle: string;
  formWelcomeDescription: string;
  resellerTermsItems: string[];
  privacyPolicyText: string;
}
