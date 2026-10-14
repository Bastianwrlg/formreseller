import React, { useState, useEffect } from 'react';
import {
  Store,
  Globe,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Info,
} from 'lucide-react';
import {
  FormData,
  FormErrors,
  OperatingStatus,
  ComplianceCheck,
  OnlineOperatingStatus,
  PlatformComplianceCheck,
  FormSettings,
} from '../../types/form';
import { MARKETPLACE_PLATFORMS } from '../../data/indonesia';

interface Step5CProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: FormSettings;
}

export const Step5CBothStores: React.FC<Step5CProps> = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrev,
  settings,
}) => {
  const [subTab, setSubTab] = useState<'physical' | 'online'>('physical');

  // Check completion of Bagian A (Physical)
  const isPhysicalFilled =
    !!formData.physicalStoreName?.trim() &&
    !!formData.physicalStoreAddress?.trim() &&
    !!formData.physicalStoreMapsUrl?.trim() &&
    !!formData.physicalStorePicName?.trim() &&
    !!formData.physicalStoreWhatsapp?.trim() &&
    !!formData.physicalStoreOperatingStatus &&
    !!formData.physicalStoreCompliance;

  // Check completion of Bagian B (Online)
  const isOnlineFilled =
    !!formData.onlineStoreName?.trim() &&
    !!formData.onlineStorePlatform &&
    !!formData.onlineStoreUrl?.trim() &&
    !!formData.onlineStoreAccountOwner?.trim() &&
    !!formData.onlineStoreOperatingStatus &&
    !!formData.onlineStorePlatformCompliance &&
    !!formData.onlineStoreAgeVerification;

  // Check errors presence in either section
  const hasPhysicalError =
    !!errors.physicalStoreName ||
    !!errors.physicalStoreAddress ||
    !!errors.physicalStoreMapsUrl ||
    !!errors.physicalStorePicName ||
    !!errors.physicalStoreWhatsapp ||
    !!errors.physicalStoreOperatingStatus ||
    !!errors.physicalStoreCompliance;

  const hasOnlineError =
    !!errors.onlineStoreName ||
    !!errors.onlineStorePlatform ||
    !!errors.onlineStorePlatformOther ||
    !!errors.onlineStoreUrl ||
    !!errors.onlineStoreAccountOwner ||
    !!errors.onlineStoreOperatingStatus ||
    !!errors.onlineStorePlatformCompliance ||
    !!errors.onlineStoreAgeVerification;

  // Automatically switch tab if error belongs to the other tab
  useEffect(() => {
    if (hasOnlineError && !hasPhysicalError && subTab === 'physical') {
      setSubTab('online');
    } else if (hasPhysicalError && !hasOnlineError && subTab === 'online') {
      setSubTab('physical');
    }
  }, [errors]);

  // Handler for primary forward button
  const handlePrimaryAction = () => {
    if (subTab === 'physical') {
      // If currently on Physical tab, check if Physical is complete
      if (isPhysicalFilled) {
        // Switch to Online tab so user can complete Bagian B!
        setSubTab('online');
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        // Trigger validation to highlight missing physical fields
        onNext();
      }
    } else {
      // Currently on Online tab, proceed to Step 6
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        {/* Title Header */}
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
            5C
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                HALAMAN 5C: INFORMASI TOKO FISIK DAN TOKO ONLINE
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 shrink-0">
                Fisik & Online
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Anda memilih saluran penjualan gabungan. Harap lengkapi <strong>Bagian A (Toko Fisik)</strong> dan <strong>Bagian B (Toko Online)</strong>.
            </p>
          </div>
        </div>

        {/* Global Error Notice if any fields are missing */}
        {(hasPhysicalError || hasOnlineError) && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-3 mb-5 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-rose-950">
                Masih ada data wajib yang belum diisi:
              </p>
              <p className="text-rose-800 mt-0.5">
                {hasPhysicalError && hasOnlineError
                  ? 'Periksa kembali kelengkapan data di Bagian A (Toko Fisik) dan Bagian B (Toko Online).'
                  : hasPhysicalError
                  ? 'Field di Bagian A (Toko Fisik) belum lengkap. Harap lengkapi semua field bertanda (*).'
                  : 'Bagian A sudah terisi, namun Bagian B (Toko Online) belum diisi. Silakan lengkapi data toko online di tab Bagian B.'}
              </p>
            </div>
          </div>
        )}

        {/* Interactive Section Tabs with Live Status Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setSubTab('physical')}
            className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
              subTab === 'physical'
                ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  subTab === 'physical' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                  Bagian A: Toko Fisik
                </span>
                <span className="text-[11px] text-slate-500">
                  Data gerai & lokasi fisik
                </span>
              </div>
            </div>

            <div className="shrink-0 ml-2">
              {isPhysicalFilled ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Lengkap</span>
                </span>
              ) : hasPhysicalError ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                  <AlertCircle className="w-3 h-3" />
                  <span>Belum Lengkap</span>
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400">
                  Wajib Diisi
                </span>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('online')}
            className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
              subTab === 'online'
                ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  subTab === 'online' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                  Bagian B: Toko Online
                </span>
                <span className="text-[11px] text-slate-500">
                  Data e-commerce / website
                </span>
              </div>
            </div>

            <div className="shrink-0 ml-2">
              {isOnlineFilled ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Lengkap</span>
                </span>
              ) : hasOnlineError ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                  <AlertCircle className="w-3 h-3" />
                  <span>Belum Lengkap</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  <span>Wajib Diisi</span>
                </span>
              )}
            </div>
          </button>
        </div>

        {/* --- BAGIAN A: TOKO FISIK --- */}
        {subTab === 'physical' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Sedang menampilkan <strong>Bagian A (Toko Fisik)</strong>. Setelah bagian ini terisi, klik tombol <em>&quot;Lanjut ke Bagian B (Toko Online)&quot;</em> di bawah untuk mengisi data toko daring Anda.
              </span>
            </div>

            {/* 16C: Nama Toko Fisik */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                16C. Nama Toko Fisik <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.physicalStoreName}
                onChange={(e) => setFormData((prev) => ({ ...prev, physicalStoreName: e.target.value }))}
                placeholder="Contoh: Vape Store Central Bandung"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.physicalStoreName
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.physicalStoreName && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.physicalStoreName}</span>
                </p>
              )}
            </div>

            {/* 17C: Alamat Lengkap Toko Fisik */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                17C. Alamat Lengkap Toko Fisik <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.physicalStoreAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, physicalStoreAddress: e.target.value }))}
                placeholder="Alamat lengkap gerai toko fisik..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.physicalStoreAddress
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.physicalStoreAddress && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.physicalStoreAddress}</span>
                </p>
              )}
            </div>

            {/* 18C: Link Lokasi Google Maps */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                18C. Link Lokasi Google Maps <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.physicalStoreMapsUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, physicalStoreMapsUrl: e.target.value }))}
                  placeholder="https://maps.google.com/?q=... atau https://maps.app.goo.gl/..."
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                    errors.physicalStoreMapsUrl
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                {formData.physicalStoreMapsUrl && (
                  <a
                    href={formData.physicalStoreMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-2.5 text-blue-600 hover:text-blue-800 p-1"
                    title="Uji buka link Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              {errors.physicalStoreMapsUrl && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.physicalStoreMapsUrl}</span>
                </p>
              )}
            </div>

            {/* 19C & 20C: PIC & WhatsApp Toko */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  19C. Nama Penanggung Jawab Operasional <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.physicalStorePicName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, physicalStorePicName: e.target.value }))}
                  placeholder="Contoh: Budi Prasetyo"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                    errors.physicalStorePicName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.physicalStorePicName && (
                  <p className="text-xs text-rose-600 mt-1">{errors.physicalStorePicName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  20C. Nomor WhatsApp Toko <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.physicalStoreWhatsapp}
                  onChange={(e) => setFormData((prev) => ({ ...prev, physicalStoreWhatsapp: e.target.value }))}
                  placeholder="Contoh: 081299998888"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                    errors.physicalStoreWhatsapp ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.physicalStoreWhatsapp && (
                  <p className="text-xs text-rose-600 mt-1">{errors.physicalStoreWhatsapp}</p>
                )}
              </div>
            </div>

            {/* 21C: Status Operasional Toko Fisik */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                21C. Status Operasional Toko Fisik <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {(['Sudah beroperasi', 'Belum beroperasi'] as OperatingStatus[]).map((status) => (
                  <label
                    key={status}
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer ${
                      formData.physicalStoreOperatingStatus === status
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="physicalStoreOperatingStatus5c"
                      checked={formData.physicalStoreOperatingStatus === status}
                      onChange={() => setFormData((prev) => ({ ...prev, physicalStoreOperatingStatus: status }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">{status}</span>
                  </label>
                ))}
              </div>
              {errors.physicalStoreOperatingStatus && (
                <p className="text-xs text-rose-600 mt-1">{errors.physicalStoreOperatingStatus}</p>
              )}
            </div>

            {/* 22C: Apakah Lokasi Memenuhi Ketentuan Penjualan Rokok Elektronik? */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                22C. Apakah Lokasi Memenuhi Ketentuan Penjualan Rokok Elektronik? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {(['Ya', 'Tidak', 'Belum dapat memastikan'] as ComplianceCheck[]).map((ans) => (
                  <label
                    key={ans}
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer ${
                      formData.physicalStoreCompliance === ans
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="physicalStoreCompliance5c"
                      checked={formData.physicalStoreCompliance === ans}
                      onChange={() => setFormData((prev) => ({ ...prev, physicalStoreCompliance: ans }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">{ans}</span>
                  </label>
                ))}
              </div>
              {errors.physicalStoreCompliance && (
                <p className="text-xs text-rose-600 mt-1">{errors.physicalStoreCompliance}</p>
              )}
            </div>
          </div>
        )}

        {/* --- BAGIAN B: TOKO ONLINE --- */}
        {subTab === 'online' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs text-indigo-900 flex items-start space-x-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Sedang menampilkan <strong>Bagian B (Toko Online)</strong>. Isi informasi akun toko online atau marketplace yang Anda gunakan untuk berjualan e-liquid.
              </span>
            </div>

            {/* 23C: Nama Toko Online */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                23C. Nama Toko Online <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.onlineStoreName}
                onChange={(e) => setFormData((prev) => ({ ...prev, onlineStoreName: e.target.value }))}
                placeholder="Contoh: Official_VapeOnline_Store"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                  errors.onlineStoreName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.onlineStoreName && (
                <p className="text-xs text-rose-600 mt-1">{errors.onlineStoreName}</p>
              )}
            </div>

            {/* 24C: Marketplace atau Platform Penjualan */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                24C. Marketplace atau Platform Penjualan <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.onlineStorePlatform}
                onChange={(e) => setFormData((prev) => ({ ...prev, onlineStorePlatform: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white ${
                  errors.onlineStorePlatform ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
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
                <input
                  type="text"
                  value={formData.onlineStorePlatformOther}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, onlineStorePlatformOther: e.target.value }))
                  }
                  placeholder="Sebutkan platform lainnya..."
                  className="w-full mt-2 px-4 py-2 rounded-xl border border-slate-300 text-sm"
                />
              )}
              {errors.onlineStorePlatform && (
                <p className="text-xs text-rose-600 mt-1">{errors.onlineStorePlatform}</p>
              )}
            </div>

            {/* 25C: Link/URL Toko Online */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                25C. Link/URL Toko Online <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.onlineStoreUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, onlineStoreUrl: e.target.value }))}
                  placeholder="https://shopee.co.id/... atau https://tokopedia.com/..."
                  className={`w-full pr-10 px-4 py-2.5 rounded-xl border text-sm ${
                    errors.onlineStoreUrl ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {formData.onlineStoreUrl && (
                  <a
                    href={formData.onlineStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-2.5 text-blue-600 p-1"
                    title="Buka link toko"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              {errors.onlineStoreUrl && (
                <p className="text-xs text-rose-600 mt-1">{errors.onlineStoreUrl}</p>
              )}
            </div>

            {/* 26C & 27C: Seller ID & Nama Pemilik Akun Seller */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  26C. Seller ID <span className="text-[10px] text-slate-400 font-mono">[Opsional]</span>
                </label>
                <input
                  type="text"
                  value={formData.onlineStoreSellerId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, onlineStoreSellerId: e.target.value }))}
                  placeholder="ID Akun Penjual..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  27C. Nama Pemilik Akun Seller <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.onlineStoreAccountOwner}
                  onChange={(e) => setFormData((prev) => ({ ...prev, onlineStoreAccountOwner: e.target.value }))}
                  placeholder="Nama terdaftar akun seller..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                    errors.onlineStoreAccountOwner ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.onlineStoreAccountOwner && (
                  <p className="text-xs text-rose-600 mt-1">{errors.onlineStoreAccountOwner}</p>
                )}
              </div>
            </div>

            {/* 28C: Status Operasional Toko Online */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                28C. Status Operasional Toko Online <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {(['Sudah aktif', 'Belum aktif'] as OnlineOperatingStatus[]).map((status) => (
                  <label
                    key={status}
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer ${
                      formData.onlineStoreOperatingStatus === status
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="onlineStoreOperatingStatus5c"
                      checked={formData.onlineStoreOperatingStatus === status}
                      onChange={() => setFormData((prev) => ({ ...prev, onlineStoreOperatingStatus: status }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">{status}</span>
                  </label>
                ))}
              </div>
              {errors.onlineStoreOperatingStatus && (
                <p className="text-xs text-rose-600 mt-1">{errors.onlineStoreOperatingStatus}</p>
              )}
            </div>

            {/* 29C: Apakah Platform Memperbolehkan Penjualan Produk Rokok Elektronik? */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                29C. Apakah Platform Memperbolehkan Penjualan Produk Rokok Elektronik yang Didaftarkan? <span className="text-rose-500">*</span>
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
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer ${
                      formData.onlineStorePlatformCompliance === ans
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="onlineStorePlatformCompliance5c"
                      checked={formData.onlineStorePlatformCompliance === ans}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, onlineStorePlatformCompliance: ans }))
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">{ans}</span>
                  </label>
                ))}
              </div>
              {errors.onlineStorePlatformCompliance && (
                <p className="text-xs text-rose-600 mt-1">{errors.onlineStorePlatformCompliance}</p>
              )}
            </div>

            {/* 30C: Apakah Sistem Penjualan Online Memiliki Verifikasi Usia? */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                30C. Apakah Sistem Penjualan Online Memiliki Verifikasi Usia Sesuai Ketentuan yang Berlaku? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {(['Ya', 'Tidak', 'Belum dapat memastikan'] as ComplianceCheck[]).map((ans) => (
                  <label
                    key={ans}
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer ${
                      formData.onlineStoreAgeVerification === ans
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="onlineStoreAgeVerification5c"
                      checked={formData.onlineStoreAgeVerification === ans}
                      onChange={() => setFormData((prev) => ({ ...prev, onlineStoreAgeVerification: ans }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">{ans}</span>
                  </label>
                ))}
              </div>
              {errors.onlineStoreAgeVerification && (
                <p className="text-xs text-rose-600 mt-1">{errors.onlineStoreAgeVerification}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            if (subTab === 'online') {
              setSubTab('physical');
              window.scrollTo({ top: 120, behavior: 'smooth' });
            } else {
              onPrev();
            }
          }}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {subTab === 'online' ? '← Kembali ke Bagian A (Fisik)' : 'Sebelumnya (Hal 4)'}
          </span>
        </button>

        <button
          type="button"
          onClick={handlePrimaryAction}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <span>
            {subTab === 'physical'
              ? 'Lanjut ke Bagian B (Toko Online)'
              : 'Berikutnya (Informasi Produk & Distributor)'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
