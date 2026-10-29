export interface FormPageSettings {
  // Global
  lastUpdated: string;
  updatedBy: string;

  // Halaman 1: Ketentuan Umum
  halaman1: {
    announcementNotice: string;
    showAnnouncement: boolean;
    requireConsent: boolean;
    supportEmail: string;
    supportPhone: string;
  };

  // Halaman 2: Informasi Pemohon & Pemilik
  halaman2: {
    allowPowerOfAttorney: boolean; // Izinkan opsi penerima kuasa
    defaultSameAsApplicant: boolean;
  };

  // Halaman 3: Identitas Usaha & Legalitas
  halaman3: {
    nibRequired: boolean;
    nibDigitLength: number;
    allowedBusinessTypes: string[];
  };

  // Halaman 4: Saluran Penjualan
  halaman4: {
    allowPhysicalOnly: boolean;
    allowOnlineOnly: boolean;
    allowBothPhysicalOnline: boolean;
    closedChannelMessage: string;
  };

  // Halaman 5: Toko Fisik & Online (5A/5B/5C)
  halaman5: {
    enforceSchoolZoning: boolean;
    enforceAgeVerification: boolean;
    allowedOnlinePlatforms: string[];
  };

  // Halaman 6: Merek Produk PODA
  halaman6: {
    availableBrands: string[];
    allowOtherBrandOption: boolean;
    allowDirectCompanyPurchase: boolean;
  };

  // Halaman 7: Dokumen Pendukung
  halaman7: {
    requireInvoiceProof: boolean; // Jadikan faktur wajib atau opsional
    requireNibDoc: boolean;
    requireStorePhoto: boolean;
    allowUploadLater: boolean; // Izinkan pendaftar menyusulkan dokumen lewat WhatsApp
    maxUploadSizeMb: number;
  };

  // Halaman 8: Ketentuan SOP & Privasi
  halaman8: {
    minimumAgeLimit: number;
    strictPriceCompliance: boolean;
  };

  // Halaman 9: Pernyataan & Tanda Tangan
  halaman9: {
    integrityPactHeading: string;
    requireAuditAgreement: boolean;
  };
}

export const DEFAULT_FORM_SETTINGS: FormPageSettings = {
  lastUpdated: new Date().toISOString(),
  updatedBy: 'Sistem Default PT. PODA E-LIQUID COMPANY',

  halaman1: {
    announcementNotice:
      'Pendaftaran Otorisasi Reseller Resmi PT. PODA E-LIQUID COMPANY Periode 2026 Dibuka. Pastikan dokumen NIB OSS dan identitas gerai telah siap.',
    showAnnouncement: true,
    requireConsent: true,
    supportEmail: 'compliance@podaliquid.co.id',
    supportPhone: '0812-9876-5432',
  },

  halaman2: {
    allowPowerOfAttorney: true,
    defaultSameAsApplicant: false,
  },

  halaman3: {
    nibRequired: true,
    nibDigitLength: 13,
    allowedBusinessTypes: [
      'Usaha perseorangan',
      'Perseroan Terbatas (PT)',
      'Persekutuan Komanditer (CV)',
      'Koperasi',
      'Bentuk usaha lainnya',
    ],
  },

  halaman4: {
    allowPhysicalOnly: true,
    allowOnlineOnly: true,
    allowBothPhysicalOnline: true,
    closedChannelMessage: 'Saluran penjualan ini sedang ditutup sementara untuk evaluasi kuota wilayah.',
  },

  halaman5: {
    enforceSchoolZoning: true,
    enforceAgeVerification: true,
    allowedOnlinePlatforms: [
      'Shopee',
      'Tokopedia',
      'TikTok Shop',
      'Lazada',
      'Website toko sendiri',
      'Platform lainnya',
    ],
  },

  halaman6: {
    availableBrands: [
      'PODA Salt Series (Premium SaltNic 30ml)',
      'PODA Freebase Series (60ml & 100ml)',
      'PODA Pods & Cartridges System',
      'PODA Disposable & Device Series',
      'Merek Lain Yang Dikelola PT. PODA E-LIQUID COMPANY',
    ],
    allowOtherBrandOption: true,
    allowDirectCompanyPurchase: true,
  },

  halaman7: {
    requireInvoiceProof: false, // Default: opsional / anjuran
    requireNibDoc: false, // Default ramah pengguna: boleh disusulkan
    requireStorePhoto: false, // Default ramah pengguna: boleh disusulkan
    allowUploadLater: true, // Kemudahan: izinkan menyusulkan berkas lewat WA
    maxUploadSizeMb: 10,
  },

  halaman8: {
    minimumAgeLimit: 21,
    strictPriceCompliance: true,
  },

  halaman9: {
    integrityPactHeading: 'Pakta Integritas & Pernyataan Kebenaran Data',
    requireAuditAgreement: true,
  },
};
