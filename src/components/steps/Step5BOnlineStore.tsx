import React from 'react';
import { Globe, ArrowRight, ArrowLeft, AlertCircle, ExternalLink, Info } from 'lucide-react';
import {
  FormData,
  FormErrors,
  OnlineOperatingStatus,
  PlatformComplianceCheck,
  ComplianceCheck,
  FormSettings,
} from '../../types/form';
import { MARKETPLACE_PLATFORMS } from '../../data/indonesia';

interface Step5BProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: FormSettings;
}

export const Step5BOnlineStore: React.FC<Step5BProps> = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrev,
  settings,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
            5B
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                HALAMAN 5B: INFORMASI TOKO ONLINE
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Khusus Toko Online Saja
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hanya ditampilkan kepada pemohon yang memilih Toko Online Saja
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs sm:text-sm text-indigo-900 leading-relaxed mb-6">
          <p className="font-semibold text-indigo-950 mb-0.5">Catatan Regulasi Platform:</p>
          Daftar platform hanya untuk mengidentifikasi kanal penjualan yang Anda gunakan. Pencantuman platform bukan berarti perusahaan menyatakan bahwa platform tersebut secara umum memperbolehkan penjualan rokok elektronik tanpa syarat.
        </div>

        <div className="space-y-5">
          {/* 16B: Nama Toko Online */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              16B. Nama Toko Online <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.onlineStoreName}
              onChange={(e) => setFormData((prev) => ({ ...prev, onlineStoreName: e.target.value }))}
              placeholder="Contoh: Official_VapeCloud_Store"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                errors.onlineStoreName
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.onlineStoreName && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.onlineStoreName}</span>
              </p>
            )}
          </div>

          {/* 17B: Marketplace atau Platform Penjualan */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              17B. Marketplace atau Platform Penjualan <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.onlineStorePlatform}
              onChange={(e) => setFormData((prev) => ({ ...prev, onlineStorePlatform: e.target.value }))}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all bg-white focus:outline-hidden focus:ring-2 ${
                errors.onlineStorePlatform
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            >
              <option value="">-- Pilih Marketplace / Platform --</option>
              {(settings?.platformsList && settings.platformsList.length > 0 ? settings.platformsList : MARKETPLACE_PLATFORMS).map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>

            {formData.onlineStorePlatform === 'Platform lainnya' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={formData.onlineStorePlatformOther}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, onlineStorePlatformOther: e.target.value }))
                  }
                  placeholder="Sebutkan platform e-commerce lainnya..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
                {errors.onlineStorePlatformOther && (
                  <p className="text-xs text-rose-600 mt-1">{errors.onlineStorePlatformOther}</p>
                )}
              </div>
            )}

            {errors.onlineStorePlatform && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.onlineStorePlatform}</span>
              </p>
            )}
          </div>

          {/* 18B: Link/URL Toko Online */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              18B. Link/URL Toko Online <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Salin tautan profil toko online Anda dari web browser atau aplikasi.
            </p>
            <div className="relative">
              <input
                type="url"
                value={formData.onlineStoreUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, onlineStoreUrl: e.target.value }))}
                placeholder="https://shopee.co.id/... atau https://tokopedia.com/..."
                className={`w-full pr-10 px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.onlineStoreUrl
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {formData.onlineStoreUrl && (
                <a
                  href={formData.onlineStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-2.5 text-blue-600 hover:text-blue-800 p-1"
                  title="Buka link toko"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            {errors.onlineStoreUrl && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.onlineStoreUrl}</span>
              </p>
            )}
          </div>

          {/* 19B & 20B: Seller ID (Opsional) & Nama Pemilik Akun Seller (Wajib) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-900">
                  19B. Seller ID atau Identitas Akun
                </label>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                  [Opsional]
                </span>
              </div>
              <input
                type="text"
                value={formData.onlineStoreSellerId}
                onChange={(e) => setFormData((prev) => ({ ...prev, onlineStoreSellerId: e.target.value }))}
                placeholder="Contoh: ID-SHOP-99214 atau Username Seller"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                20B. Nama Pemilik Akun Seller <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500 mb-1">
                Nama pihak/badan usaha yang terdaftar resmi di akun toko.
              </p>
              <input
                type="text"
                value={formData.onlineStoreAccountOwner}
                onChange={(e) => setFormData((prev) => ({ ...prev, onlineStoreAccountOwner: e.target.value }))}
                placeholder="Contoh: PT Cloud Jaya Retail"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.onlineStoreAccountOwner
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.onlineStoreAccountOwner && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.onlineStoreAccountOwner}</span>
                </p>
              )}
            </div>
          </div>

          {/* 21B: Apakah Akun Toko Sudah Aktif Berjualan? */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              21B. Apakah Akun Toko Sudah Aktif Berjualan? <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {(['Sudah aktif', 'Belum aktif'] as OnlineOperatingStatus[]).map((status) => (
                <label
                  key={status}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.onlineStoreOperatingStatus === status
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="onlineStoreOperatingStatus"
                    checked={formData.onlineStoreOperatingStatus === status}
                    onChange={() => setFormData((prev) => ({ ...prev, onlineStoreOperatingStatus: status }))}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{status}</span>
                </label>
              ))}
            </div>
            {errors.onlineStoreOperatingStatus && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.onlineStoreOperatingStatus}</span>
              </p>
            )}
          </div>

          {/* 22B: Apakah Platform yang Digunakan Memperbolehkan Penjualan Produk Rokok Elektronik? */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              22B. Apakah Platform yang Digunakan Memperbolehkan Penjualan Produk Rokok Elektronik yang Didaftarkan? <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2 mt-2">
              {(
                [
                  'Ya, berdasarkan ketentuan platform yang berlaku',
                  'Tidak',
                  'Belum dapat memastikan',
                ] as PlatformComplianceCheck[]
              ).map((ans) => (
                <label
                  key={ans}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.onlineStorePlatformCompliance === ans
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="onlineStorePlatformCompliance"
                    checked={formData.onlineStorePlatformCompliance === ans}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, onlineStorePlatformCompliance: ans }))
                    }
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{ans}</span>
                </label>
              ))}
            </div>
            {errors.onlineStorePlatformCompliance && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.onlineStorePlatformCompliance}</span>
              </p>
            )}
          </div>

          {/* 23B: Apakah Sistem Penjualan Online Memiliki Verifikasi Usia Pembeli? */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              23B. Apakah Sistem Penjualan Online Memiliki Verifikasi Usia Pembeli Sesuai Ketentuan yang Berlaku? <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              (Memastikan produk tidak dapat dibeli oleh konsumen di bawah usia yang dilarang).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              {(['Ya', 'Tidak', 'Belum dapat memastikan'] as ComplianceCheck[]).map((ans) => (
                <label
                  key={ans}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.onlineStoreAgeVerification === ans
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="onlineStoreAgeVerification"
                    checked={formData.onlineStoreAgeVerification === ans}
                    onChange={() => setFormData((prev) => ({ ...prev, onlineStoreAgeVerification: ans }))}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{ans}</span>
                </label>
              ))}
            </div>
            {errors.onlineStoreAgeVerification && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.onlineStoreAgeVerification}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <span>Berikutnya (Informasi Produk & Distributor)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
