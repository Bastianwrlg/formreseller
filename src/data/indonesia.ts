export const INDONESIA_PROVINCES = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Kepulauan Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'DKI Jakarta',
  'Banten',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Gorontalo',
  'Sulawesi Tengah',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Selatan',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Barat Daya',
];

import { FormSettings } from '../types/form';

export const COMPANY_NAME = 'PT. PODA E-LIQUID COMPANY';

export const AVAILABLE_BRANDS = [
  'PODA Salt Series (Premium SaltNic 30ml)',
  'PODA Freebase Series (60ml & 100ml)',
  'PODA Pods & Cartridges System',
  'PODA Disposable & Device Series',
  'Merek Lain Yang Dikelola PT. PODA E-LIQUID COMPANY',
];

export const MARKETPLACE_PLATFORMS = [
  'Shopee',
  'Tokopedia',
  'TikTok Shop',
  'Lazada',
  'Website toko sendiri',
  'Platform lainnya',
];

export const defaultFormSettings: FormSettings = {
  companyName: 'PT. PODA E-LIQUID COMPANY',
  companyTagline: 'Official E-Liquid Manufacturer & Authorized Distribution Network',
  companyAddress: 'PODA Industrial Park, Sentra Niaga E-Liquid Indonesia',
  companyPhone: '(021) 7889-1000',
  complianceEmail: 'compliance@podaliquid.co.id',
  letterSignerName: 'Direktur Kemitraan & Legal',
  letterSignerRole: 'Divisi Otorisasi Reseller & Kemitraan',

  isRegistrationOpen: true,
  registrationClosedMessage: 'Pendaftaran kemitraan reseller saat ini sedang ditutup sementara untuk proses penyesuaian kuota wilayah. Silakan hubungi tim sales kami untuk informasi pembukaan periode berikutnya.',
  registrationPrefix: 'REG',

  brandsList: [
    'PODA Salt Series (Premium SaltNic 30ml)',
    'PODA Freebase Series (60ml & 100ml)',
    'PODA Pods & Cartridges System',
    'PODA Disposable & Device Series',
  ],
  allowOtherBrand: true,

  platformsList: [
    'Shopee',
    'Tokopedia',
    'TikTok Shop',
    'Lazada',
    'Website toko sendiri',
    'Platform lainnya',
  ],

  maxFileSizeMb: 10,
  isPhysicalStorePhotoRequired: true,
  isPurchaseProofRequired: true,
  isPowerOfAttorneyRequired: true,

  formWelcomeTitle: 'FORMULIR PENDAFTARAN RESELLER RESMI',
  formWelcomeDescription: 'Selamat datang di layanan pendaftaran reseller resmi PT. PODA E-LIQUID COMPANY. Formulir ini diperuntukkan bagi pemilik toko fisik dan/atau toko online yang ingin mengajukan Surat Penunjukan Reseller atas produk e-liquid resmi yang diproduksi dan didistribusikan oleh perusahaan.',
  resellerTermsItems: [
    'Pendaftaran dilakukan oleh pemilik usaha, pengurus yang berwenang, atau pihak yang memperoleh kuasa yang sah.',
    'Pemohon wajib memberikan informasi usaha yang benar dan dokumen pendukung yang dapat diverifikasi secara faktual.',
    'Satu pendaftaran berlaku untuk satu lokasi toko fisik dan paling banyak satu akun toko online.',
    'Apabila memiliki beberapa cabang atau akun toko online, pemohon wajib melakukan pendaftaran tambahan terpisah.',
    'Seluruh permohonan akan melalui proses verifikasi data dan kepatuhan dari tim verifikasi perusahaan.',
    'Pengisian formulir tidak otomatis memberikan status atau hak sebagai reseller resmi.',
    'Surat Penunjukan Reseller hanya diterbitkan kepada pemohon yang disetujui perusahaan setelah verifikasi menyeluruh.',
    'Surat hanya berlaku untuk identitas toko, merek, dan saluran penjualan yang tercantum secara spesifik dalam surat.',
  ],
  privacyPolicyText: 'PT. PODA E-LIQUID COMPANY bertindak sebagai pengendali data pribadi yang dikumpulkan melalui formulir ini sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022). Data meliputi identitas pemohon, informasi kontak, identitas usaha, alamat toko fisik, informasi akun online, serta dokumen pendukung verifikasi.',
};

export const BUSINESS_TYPES = [
  'Usaha perseorangan',
  'Perseroan Terbatas (PT)',
  'Persekutuan Komanditer (CV)',
  'Koperasi',
  'Bentuk usaha lainnya',
];

export const APPLICANT_RELATIONS = [
  'Pemilik usaha perseorangan',
  'Direktur/pengurus badan usaha yang berwenang',
  'Penerima kuasa dari pemilik atau pengurus yang berwenang',
];

export const ADMIN_DECISION_RULES = [
  {
    decision: 'Dapat diajukan untuk persetujuan',
    status: 'approved',
    condition: 'Identitas usaha dan pemilik sesuai, dokumen lengkap, kanal memenuhi ketentuan',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    decision: 'Dapat dilanjutkan',
    status: 'continued',
    condition: 'Pengisi bukan pemilik tetapi memiliki kuasa yang dapat diverifikasi',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    decision: 'Tahan permohonan',
    status: 'on_hold',
    condition: 'Pengisi bukan pemilik & tidak mempunyai bukti kewenangan, atau asal produk belum jelas',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    decision: 'Tolak otorisasi untuk lokasi atau platform tersebut',
    status: 'channel_rejected',
    condition: 'Lokasi atau platform penjualan tidak memenuhi ketentuan',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  {
    decision: 'Ditolak',
    status: 'rejected',
    condition: 'Dokumen palsu / tidak valid / pelanggaran ketentuan fatal',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
  },
];
