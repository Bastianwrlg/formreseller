import { FormData, FormErrors } from '../types/form';
import { FormPageSettings } from '../types/formSettings';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+62|62|0)[0-9]{8,14}$/;

export function validateStep(
  step: number,
  data: FormData,
  settings?: FormPageSettings
): FormErrors {
  const errors: FormErrors = {};

  // STEP 1: KETENTUAN UMUM
  if (step === 1) {
    const requireConsent = settings?.halaman1?.requireConsent ?? true;
    if (requireConsent && !data.acceptedGeneralInfo) {
      errors.acceptedGeneralInfo =
        'Harap centang konfirmasi bahwa Anda telah membaca ketentuan umum pendaftaran.';
    }
  }

  // STEP 2: PEMOHON & PEMILIK
  if (step === 2) {
    if (!data.applicantName?.trim()) {
      errors.applicantName = 'Nama Lengkap Pemohon wajib diisi sesuai identitas resmi.';
    } else if (data.applicantName.trim().length < 3) {
      errors.applicantName = 'Nama Lengkap Pemohon minimal 3 karakter.';
    }

    if (!data.applicantRelation) {
      errors.applicantRelation = 'Pilih hubungan Anda dengan usaha yang didaftarkan.';
    } else if (
      settings?.halaman2?.allowPowerOfAttorney === false &&
      data.applicantRelation === 'Penerima kuasa dari pemilik atau pengurus yang berwenang'
    ) {
      errors.applicantRelation =
        'Pendaftaran melalui kuasa sedang dinonaktifkan oleh manajemen. Hanya pemilik/direksi yang dapat mendaftar.';
    }

    if (!data.applicantWhatsapp?.trim()) {
      errors.applicantWhatsapp = 'Nomor WhatsApp Pemohon wajib diisi.';
    } else {
      const cleanPhone = data.applicantWhatsapp.replace(/[\s-]/g, '');
      if (!PHONE_REGEX.test(cleanPhone)) {
        errors.applicantWhatsapp =
          'Format nomor WhatsApp tidak valid (contoh: 08123456789 atau +628123456789).';
      }
    }

    if (!data.applicantEmail?.trim()) {
      errors.applicantEmail = 'Alamat Email Pemohon wajib diisi.';
    } else if (!EMAIL_REGEX.test(data.applicantEmail.trim())) {
      errors.applicantEmail = 'Format alamat email tidak valid (contoh: nama@domain.com).';
    }

    if (!data.ownerName?.trim()) {
      errors.ownerName = 'Nama Pemilik Usaha atau Pengurus yang Berwenang wajib diisi.';
    }

    if (!data.ownerWhatsapp?.trim()) {
      errors.ownerWhatsapp = 'Nomor WhatsApp Pemilik/Pengurus wajib diisi.';
    } else {
      const cleanPhone = data.ownerWhatsapp.replace(/[\s-]/g, '');
      if (!PHONE_REGEX.test(cleanPhone)) {
        errors.ownerWhatsapp = 'Format nomor WhatsApp tidak valid (contoh: 08123456789).';
      }
    }

    if (!data.ownerEmail?.trim()) {
      errors.ownerEmail = 'Email Pemilik/Pengurus yang Berwenang wajib diisi.';
    } else if (!EMAIL_REGEX.test(data.ownerEmail.trim())) {
      errors.ownerEmail = 'Format alamat email tidak valid.';
    }
  }

  // STEP 3: IDENTITAS USAHA & LEGALITAS
  if (step === 3) {
    if (!data.businessTradeName?.trim()) {
      errors.businessTradeName = 'Nama Toko atau Nama Dagang wajib diisi (contoh: ABC Vape Store).';
    }

    if (!data.businessType) {
      errors.businessType = 'Bentuk Usaha wajib dipilih.';
    } else if (data.businessType === 'Bentuk usaha lainnya' && !data.businessTypeOther?.trim()) {
      errors.businessTypeOther = 'Sebutkan bentuk usaha lainnya secara jelas.';
    }

    if (!data.businessLegalName?.trim()) {
      errors.businessLegalName =
        'Nama Pemilik Usaha/Badan Usaha sesuai dokumen legalitas wajib diisi.';
    }

    // Dynamic NIB requirement & digit length from admin settings
    const nibRequired = settings?.halaman3?.nibRequired ?? true;
    const nibDigitLen = settings?.halaman3?.nibDigitLength || 13;

    if (nibRequired) {
      if (!data.nibNumber?.trim()) {
        errors.nibNumber = 'Nomor Induk Berusaha (NIB) wajib diisi.';
      } else {
        const cleanNib = data.nibNumber.replace(/[\s-]/g, '');
        const nibRegex = new RegExp(`^\\d{${nibDigitLen}}$`);
        if (!nibRegex.test(cleanNib)) {
          errors.nibNumber = `NIB harus terdiri dari ${nibDigitLen} digit angka standar OSS Indonesia.`;
        }
      }
    }

    if (!data.registeredAddress?.trim() || data.registeredAddress.trim().length < 8) {
      errors.registeredAddress = 'Alamat usaha terdaftar wajib diisi lengkap sesuai dokumen resmi.';
    }

    if (!data.city?.trim()) {
      errors.city = 'Kota/Kabupaten wajib diisi.';
    }

    if (!data.province?.trim()) {
      errors.province = 'Pilih Provinsi lokasi usaha.';
    }
  }

  // STEP 4: SALURAN PENJUALAN
  if (step === 4) {
    if (!data.salesChannel) {
      errors.salesChannel = 'Pilih salah satu jenis saluran penjualan yang akan didaftarkan.';
    } else {
      const closedMsg =
        settings?.halaman4?.closedChannelMessage ||
        'Saluran penjualan ini sedang ditutup sementara oleh manajemen.';
      if (
        data.salesChannel === 'Toko Fisik Saja' &&
        settings?.halaman4?.allowPhysicalOnly === false
      ) {
        errors.salesChannel = closedMsg;
      } else if (
        data.salesChannel === 'Toko Online Saja' &&
        settings?.halaman4?.allowOnlineOnly === false
      ) {
        errors.salesChannel = closedMsg;
      } else if (
        data.salesChannel === 'Toko Fisik dan Toko Online' &&
        settings?.halaman4?.allowBothPhysicalOnline === false
      ) {
        errors.salesChannel = closedMsg;
      }
    }
  }

  // STEP 5: TOKO FISIK (5A), TOKO ONLINE (5B), ATAU KEDUANYA (5C)
  if (step === 5) {
    const isPhysical =
      data.salesChannel === 'Toko Fisik Saja' ||
      data.salesChannel === 'Toko Fisik dan Toko Online';
    const isOnline =
      data.salesChannel === 'Toko Online Saja' ||
      data.salesChannel === 'Toko Fisik dan Toko Online';

    if (isPhysical) {
      if (!data.physicalStoreName?.trim()) {
        errors.physicalStoreName = 'Nama Toko Fisik wajib diisi.';
      }
      if (!data.physicalStoreAddress?.trim() || data.physicalStoreAddress.trim().length < 8) {
        errors.physicalStoreAddress = 'Alamat lengkap lokasi toko fisik wajib diisi.';
      }
      if (!data.physicalStoreMapsUrl?.trim()) {
        errors.physicalStoreMapsUrl = 'Link tautan Google Maps lokasi toko fisik wajib disertakan.';
      } else if (!data.physicalStoreMapsUrl.startsWith('http')) {
        errors.physicalStoreMapsUrl = 'Tautan Google Maps harus diawali dengan http:// atau https://';
      }
      if (!data.physicalStorePicName?.trim()) {
        errors.physicalStorePicName = 'Nama Penanggung Jawab Operasional Toko wajib diisi.';
      }
      if (!data.physicalStoreWhatsapp?.trim()) {
        errors.physicalStoreWhatsapp = 'Nomor WhatsApp Toko wajib diisi.';
      }
      if (!data.physicalStoreOperatingStatus) {
        errors.physicalStoreOperatingStatus = 'Pilih status operasional toko fisik saat ini.';
      }

      // Check if school zoning compliance is enforced by admin
      const enforceSchoolZoning = settings?.halaman5?.enforceSchoolZoning ?? true;
      if (enforceSchoolZoning && !data.physicalStoreCompliance) {
        errors.physicalStoreCompliance =
          'Pilih konfirmasi pemenuhan ketentuan lokasi rokok elektronik (>200m dari sekolah).';
      }
    }

    if (isOnline) {
      if (!data.onlineStoreName?.trim()) {
        errors.onlineStoreName = 'Nama Toko Online wajib diisi.';
      }
      if (!data.onlineStorePlatform) {
        errors.onlineStorePlatform = 'Pilih platform atau marketplace penjualan toko online.';
      } else if (
        data.onlineStorePlatform === 'Platform lainnya' &&
        !data.onlineStorePlatformOther?.trim()
      ) {
        errors.onlineStorePlatformOther = 'Sebutkan nama platform online lainnya.';
      }
      if (!data.onlineStoreUrl?.trim()) {
        errors.onlineStoreUrl = 'Link/URL Toko Online wajib diisi.';
      } else if (!data.onlineStoreUrl.startsWith('http')) {
        errors.onlineStoreUrl = 'URL harus diawali dengan http:// atau https://';
      }
      if (!data.onlineStoreAccountOwner?.trim()) {
        errors.onlineStoreAccountOwner = 'Nama Pemilik Akun Seller wajib diisi.';
      }
      if (!data.onlineStoreOperatingStatus) {
        errors.onlineStoreOperatingStatus = 'Pilih status aktif akun toko online.';
      }
      if (!data.onlineStorePlatformCompliance) {
        errors.onlineStorePlatformCompliance =
          'Pilih konfirmasi izin rokok elektronik pada platform.';
      }

      // Age verification enforcement from admin settings
      const enforceAgeVerification = settings?.halaman5?.enforceAgeVerification ?? true;
      if (enforceAgeVerification && !data.onlineStoreAgeVerification) {
        errors.onlineStoreAgeVerification = 'Pilih konfirmasi sistem verifikasi usia pembeli (21+).';
      }
    }
  }

  // STEP 6: MEREK PRODUK PODA & DISTRIBUTOR
  if (step === 6) {
    if (!data.targetBrands || data.targetBrands.length === 0) {
      errors.targetBrands = 'Pilih minimal satu merek produk yang dimohonkan penunjukan.';
    } else if (
      data.targetBrands.includes('Merek Lain Yang Dikelola PT. PODA E-LIQUID COMPANY') &&
      !data.otherBrandName?.trim()
    ) {
      errors.otherBrandName = 'Sebutkan merek lain yang Anda maksud.';
    }

    if (!data.purchaseSource) {
      errors.purchaseSource = 'Pilih sumber pembelian produk Anda.';
    }

    if (!data.distributorSupplierName?.trim()) {
      errors.distributorSupplierName =
        'Nama Distributor/Pemasok wajib diisi (isi "Belum ada" jika belum pernah membeli).';
    }

    if (!data.willingToProvideProof) {
      errors.willingToProvideProof =
        'Konfirmasi kesediaan menunjukkan bukti pembelian produk wajib dipilih.';
    }
  }

  // STEP 7: DOKUMEN PENDUKUNG
  if (step === 7) {
    // Jika pemohon memilih opsi menyusulkan berkas lewat WhatsApp / verifikasi lanjutan, tidak diblokir sama sekali!
    if (data.uploadLaterConsent) {
      return errors;
    }

    // NIB Document
    const requireNibDoc = settings?.halaman7?.requireNibDoc ?? false;
    if (requireNibDoc && !data.docNib) {
      errors.docNib = 'Dokumen NIB (PDF/JPG/PNG) wajib diunggah atau pilih opsi susulkan berkas nanti.';
    }

    // Toko Fisik Foto Kondisional
    const isPhysicalPhotoRequired = settings?.halaman7?.requireStorePhoto ?? false;
    if (
      isPhysicalPhotoRequired &&
      (data.salesChannel === 'Toko Fisik Saja' ||
        data.salesChannel === 'Toko Fisik dan Toko Online') &&
      !data.docPhysicalStorePhoto
    ) {
      errors.docPhysicalStorePhoto =
        'Foto bagian depan toko fisik wajib diunggah atau pilih opsi susulkan berkas nanti.';
    }

    // Toko Online Screenshot Kondisional
    const requireOnlineScreenshot = settings?.halaman7?.requireStorePhoto ?? false;
    if (
      requireOnlineScreenshot &&
      (data.salesChannel === 'Toko Online Saja' ||
        data.salesChannel === 'Toko Fisik dan Toko Online') &&
      !data.docOnlineStoreScreenshot
    ) {
      errors.docOnlineStoreScreenshot =
        'Screenshot profil toko online wajib diunggah atau pilih opsi susulkan berkas nanti.';
    }

    // Bukti Pembelian Kondisional (Admin setting: requireInvoiceProof)
    const isPurchaseProofRequired = settings?.halaman7?.requireInvoiceProof ?? false;
    if (
      isPurchaseProofRequired &&
      data.purchaseSource &&
      data.purchaseSource !== 'Belum pernah melakukan pembelian' &&
      !data.docPurchaseProof
    ) {
      errors.docPurchaseProof =
        'Faktur / Invoice bukti pembelian resmi wajib diunggah sesuai konfigurasi admin.';
    }

    // Surat Kuasa Kondisional
    if (
      data.applicantRelation ===
        'Penerima kuasa dari pemilik atau pengurus yang berwenang' &&
      !data.docPowerOfAttorney
    ) {
      errors.docPowerOfAttorney =
        'Surat Kuasa wajib diunggah bagi pemohon yang bertindak atas nama pemilik/pengurus.';
    }
  }

  // STEP 8: SYARAT & PRIVASI
  if (step === 8) {
    if (!data.agreeTerms) {
      errors.agreeTerms = 'Anda harus membaca dan menyetujui Ketentuan Reseller sebelum melanjutkan.';
    }
    if (!data.agreePrivacy) {
      errors.agreePrivacy = 'Anda harus membaca dan menyetujui Pemberitahuan Privasi sebelum melanjutkan.';
    }
  }

  // STEP 9: PERNYATAAN AKHIR & PENGIRIMAN
  if (step === 9) {
    if (!data.statementSignerName?.trim()) {
      errors.statementSignerName = 'Nama Lengkap Pihak yang Memberikan Pernyataan wajib diisi.';
    }
    if (!data.statementTruth) {
      errors.statementTruth = 'Pernyataan kebenaran data dan kewenangan sah wajib dicentang.';
    }
    const requireAudit = settings?.halaman9?.requireAuditAgreement ?? true;
    if (requireAudit && !data.statementVerificationConsent) {
      errors.statementVerificationConsent =
        'Persetujuan konfirmasi dan proses verifikasi lanjutan wajib dicentang.';
    }
  }

  return errors;
}
