import * as XLSX from 'xlsx';
import { FormData } from '../types/form';

export function getStatusLabelIndonesian(status: string): string {
  switch (status) {
    case 'approved':
      return 'Disetujui (Otorisasi Resmi Diterbitkan)';
    case 'continued':
      return 'Dapat Dilanjutkan (Verifikasi Kuasa)';
    case 'on_hold':
      return 'Ditahan (Menunggu Dokumen/Legalitas)';
    case 'channel_rejected':
      return 'Ditolak Saluran (Zonasi/Platform)';
    case 'rejected':
      return 'Ditolak Permanen';
    case 'submitted':
      return 'Menunggu Evaluasi';
    case 'draft':
      return 'Draf Pengisian';
    default:
      return status;
  }
}

export function exportApplicationsToExcel(
  applications: FormData[],
  format: 'xlsx' | 'xls' = 'xlsx',
  filterStatus: string = 'all'
) {
  if (!applications || applications.length === 0) {
    alert('Tidak ada data permohonan untuk diekspor.');
    return;
  }

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // 1. Title & Header Information Banner
  const titleRows: (string | number)[][] = [
    ['PT. PODA E-LIQUID COMPANY'],
    ['REKAPITULASI RESMI PENDAFTARAN RESELLER & STATUS OTORISASI PENJUALAN'],
    [
      `Waktu Ekspor: ${dateFormatted} pukul ${timeFormatted} WIB | Filter: ${filterStatus.toUpperCase()} | Total: ${applications.length} Data Permohonan`,
    ],
    [], // Blank separator row
  ];

  // 2. Table Header Columns (Rapi, Terstruktur & Informatif)
  const headers = [
    'No.',
    'No. Registrasi',
    'Tanggal Pengajuan',
    'Status Permohonan',
    'Hasil Evaluasi Admin',
    'Nama Toko / Dagang',
    'Nama Legal Badan Usaha',
    'Bentuk Usaha',
    'NIB (OSS)',
    'Saluran Penjualan',
    'Provinsi',
    'Kota / Kabupaten',
    'Alamat Terdaftar Usaha',
    'Lokasi Toko Fisik',
    'Link Google Maps',
    'Nama PIC Toko Fisik',
    'WhatsApp Toko Fisik',
    'Status Toko Fisik',
    'Kepatuhan Zonasi Sekolah (>200m)',
    'Platform Toko Online',
    'Nama Toko Online',
    'Link Toko Online',
    'Seller ID / Username',
    'Nama Pemilik Akun Seller',
    'Status Toko Online',
    'Kepatuhan Platform Marketplace',
    'Verifikasi Usia Pembeli (21+)',
    'Nama Pemohon',
    'Hubungan Pemohon',
    'WhatsApp Pemohon',
    'Email Pemohon',
    'Nama Pemilik Usaha',
    'WhatsApp Pemilik Usaha',
    'Email Pemilik Usaha',
    'Merek Produk PODA Dimohonkan',
    'Sumber Pembelian Produk',
    'Nama Distributor / Supplier',
    'Kota Distributor',
    'Bersedia Beri Bukti Beli',
    'Dokumen NIB',
    'Foto Toko Fisik',
    'Screenshot Toko Online',
    'Faktur Bukti Pembelian',
    'Surat Kuasa',
    'Catatan Evaluasi Verifikator',
    'Petugas Verifikasi',
    'Waktu Verifikasi',
  ];

  // 3. Rows Content
  const dataRows: (string | number)[][] = applications.map((app, index) => {
    const regDate = app.createdAt
      ? new Date(app.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '-';

    const reviewDate = app.reviewedAt
      ? new Date(app.reviewedAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';

    return [
      index + 1,
      app.registrationNumber || app.id || '-',
      regDate,
      getStatusLabelIndonesian(app.status),
      app.adminDecision || 'Belum Dievaluasi',
      app.businessTradeName || '-',
      app.businessLegalName || '-',
      app.businessType || '-',
      // Prefix string with apostrophe-like clean text handling in Excel
      app.nibNumber ? String(app.nibNumber) : '-',
      app.salesChannel || '-',
      app.province || '-',
      app.city || '-',
      app.registeredAddress || '-',
      app.physicalStoreAddress || (app.salesChannel === 'Toko Online Saja' ? 'Tidak Ada (Toko Online Saja)' : '-'),
      app.physicalStoreMapsUrl || '-',
      app.physicalStorePicName || '-',
      app.physicalStoreWhatsapp ? String(app.physicalStoreWhatsapp) : '-',
      app.physicalStoreOperatingStatus || '-',
      app.physicalStoreCompliance || '-',
      app.onlineStorePlatform
        ? app.onlineStorePlatform === 'Platform lainnya'
          ? `Lainnya (${app.onlineStorePlatformOther || '-'})`
          : app.onlineStorePlatform
        : (app.salesChannel === 'Toko Fisik Saja' ? 'Tidak Ada (Toko Fisik Saja)' : '-'),
      app.onlineStoreName || '-',
      app.onlineStoreUrl || '-',
      app.onlineStoreSellerId || '-',
      app.onlineStoreAccountOwner || '-',
      app.onlineStoreOperatingStatus || '-',
      app.onlineStorePlatformCompliance || '-',
      app.onlineStoreAgeVerification || '-',
      app.applicantName || '-',
      app.applicantRelation || '-',
      app.applicantWhatsapp ? String(app.applicantWhatsapp) : '-',
      app.applicantEmail || '-',
      app.ownerName || '-',
      app.ownerWhatsapp ? String(app.ownerWhatsapp) : '-',
      app.ownerEmail || '-',
      app.targetBrands && app.targetBrands.length > 0 ? app.targetBrands.join('; ') : '-',
      app.purchaseSource || '-',
      app.distributorSupplierName || '-',
      app.distributorCity || '-',
      app.willingToProvideProof || '-',
      app.docNib ? `Ada (${app.docNib.name})` : 'Belum Diunggah',
      app.docPhysicalStorePhoto ? `Ada (${app.docPhysicalStorePhoto.name})` : '-',
      app.docOnlineStoreScreenshot ? `Ada (${app.docOnlineStoreScreenshot.name})` : '-',
      app.docPurchaseProof ? `Ada (${app.docPurchaseProof.name})` : 'Belum Ada',
      app.docPowerOfAttorney ? `Ada (${app.docPowerOfAttorney.name})` : 'Tidak Diperlukan',
      app.adminNotes || '-',
      app.reviewedBy || '-',
      reviewDate,
    ];
  });

  // Combine title, headers, and rows
  const fullWorksheetData = [...titleRows, headers, ...dataRows];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(fullWorksheetData);

  // Set explicit column widths (wch = width in characters) so columns are NEVER cramped or cut off!
  worksheet['!cols'] = [
    { wch: 6 },  // No.
    { wch: 22 }, // No. Registrasi
    { wch: 18 }, // Tanggal Pengajuan
    { wch: 28 }, // Status Permohonan
    { wch: 32 }, // Hasil Evaluasi Admin
    { wch: 30 }, // Nama Toko / Dagang
    { wch: 30 }, // Nama Legal Badan Usaha
    { wch: 25 }, // Bentuk Usaha
    { wch: 22 }, // NIB
    { wch: 26 }, // Saluran Penjualan
    { wch: 20 }, // Provinsi
    { wch: 22 }, // Kota
    { wch: 35 }, // Alamat Terdaftar
    { wch: 35 }, // Lokasi Toko Fisik
    { wch: 30 }, // Link Maps
    { wch: 24 }, // PIC Toko Fisik
    { wch: 22 }, // WhatsApp Toko Fisik
    { wch: 20 }, // Status Fisik
    { wch: 28 }, // Kepatuhan Zonasi
    { wch: 22 }, // Platform Online
    { wch: 26 }, // Nama Toko Online
    { wch: 35 }, // Link Toko Online
    { wch: 20 }, // Seller ID
    { wch: 26 }, // Pemilik Akun Seller
    { wch: 20 }, // Status Online
    { wch: 32 }, // Kepatuhan Platform
    { wch: 28 }, // Verifikasi Usia 21+
    { wch: 24 }, // Nama Pemohon
    { wch: 28 }, // Hubungan Pemohon
    { wch: 22 }, // WhatsApp Pemohon
    { wch: 28 }, // Email Pemohon
    { wch: 24 }, // Nama Pemilik
    { wch: 22 }, // WhatsApp Pemilik
    { wch: 28 }, // Email Pemilik
    { wch: 40 }, // Merek PODA
    { wch: 30 }, // Sumber Pembelian
    { wch: 30 }, // Nama Distributor
    { wch: 20 }, // Kota Distributor
    { wch: 24 }, // Bersedia Beri Bukti Beli
    { wch: 24 }, // Dokumen NIB
    { wch: 24 }, // Foto Fisik
    { wch: 24 }, // Screenshot Online
    { wch: 24 }, // Faktur Beli
    { wch: 24 }, // Surat Kuasa
    { wch: 40 }, // Catatan Evaluasi
    { wch: 30 }, // Petugas
    { wch: 20 }, // Waktu Verifikasi
  ];

  // Set explicit string cell types for telephone numbers & NIB to avoid scientific notation
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
  for (let R = 4; R <= range.e.r; ++R) {
    // Column indices:
    // NIB is col 8 (I)
    // WhatsApp Toko is col 16 (Q)
    // WhatsApp Pemohon is col 29 (AD)
    // WhatsApp Pemilik is col 32 (AG)
    const textColumns = [1, 8, 16, 29, 32];
    for (const C of textColumns) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (cell && cell.v !== undefined && cell.v !== '-') {
        cell.t = 's'; // Force string type
        cell.v = String(cell.v);
      }
    }
  }

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Reseller PODA');

  // File naming
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = `Rekap_Pendaftaran_Reseller_PODA_${dateStr}.${format}`;

  // Trigger download with appropriate bookType
  XLSX.writeFile(workbook, fileName, {
    bookType: format === 'xls' ? 'xls' : 'xlsx',
  });
}
