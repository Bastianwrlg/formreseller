import React from 'react';
import { Store, MapPin, ArrowRight, ArrowLeft, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { FormData, FormErrors, OperatingStatus, ComplianceCheck } from '../../types/form';

interface Step5AProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
}

export const Step5APhysicalStore: React.FC<Step5AProps> = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrev,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
            5A
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                HALAMAN 5A: INFORMASI TOKO FISIK
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Khusus Toko Fisik Saja
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hanya ditampilkan kepada pemohon yang memilih Toko Fisik Saja
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs sm:text-sm text-emerald-900 leading-relaxed mb-6">
          <p className="font-semibold text-emerald-950 mb-0.5">Petunjuk & Ketentuan Zonasi:</p>
          Lengkapi data toko fisik dengan akurat. Jawaban akan diperiksa dan divalidasi oleh tim kepatuhan perusahaan, termasuk kesesuaian ketentuan zonasi jarak minimal dari satuan pendidikan (sekolah/kampus) dan tempat bermain anak.
        </div>

        <div className="space-y-5">
          {/* 16A: Nama Toko Fisik */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              16A. Nama Toko Fisik <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.physicalStoreName}
              onChange={(e) => setFormData((prev) => ({ ...prev, physicalStoreName: e.target.value }))}
              placeholder="Contoh: Vape Lounge Kemang"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                errors.physicalStoreName
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.physicalStoreName && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.physicalStoreName}</span>
              </p>
            )}
          </div>

          {/* 17A: Alamat Lengkap Lokasi Toko */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              17A. Alamat Lengkap Lokasi Toko <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Sebutkan jalan, nomor, gedung/ruko, RT/RW, kelurahan, kecamatan.
            </p>
            <textarea
              rows={3}
              value={formData.physicalStoreAddress}
              onChange={(e) => setFormData((prev) => ({ ...prev, physicalStoreAddress: e.target.value }))}
              placeholder="Contoh: Jl. Kemang Raya No. 45B, Kel. Bangka, Kec. Mampang Prapatan, Jakarta Selatan"
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

          {/* 18A: Link Lokasi Google Maps */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              18A. Link Lokasi Google Maps <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Tempelkan tautan lokasi toko yang benar dari Google Maps untuk verifikasi titik lokasi.
            </p>
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
                  title="Uji buka link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            {errors.physicalStoreMapsUrl && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.physicalStoreMapsUrl}</span>
              </p>
            )}
          </div>

          {/* 19A & 20A: PIC & WhatsApp Toko */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                19A. Nama Penanggung Jawab Operasional Toko <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.physicalStorePicName}
                onChange={(e) => setFormData((prev) => ({ ...prev, physicalStorePicName: e.target.value }))}
                placeholder="Contoh: Rian Gunawan (Store Head)"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.physicalStorePicName
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.physicalStorePicName && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.physicalStorePicName}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                20A. Nomor WhatsApp Toko <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.physicalStoreWhatsapp}
                onChange={(e) => setFormData((prev) => ({ ...prev, physicalStoreWhatsapp: e.target.value }))}
                placeholder="Contoh: 08119876543"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.physicalStoreWhatsapp
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.physicalStoreWhatsapp && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.physicalStoreWhatsapp}</span>
                </p>
              )}
            </div>
          </div>

          {/* 21A: Apakah Toko Saat Ini Sudah Beroperasi? */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              21A. Apakah Toko Saat Ini Sudah Beroperasi? <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {(['Sudah beroperasi', 'Belum beroperasi'] as OperatingStatus[]).map((status) => (
                <label
                  key={status}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.physicalStoreOperatingStatus === status
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="physicalStoreOperatingStatus"
                    checked={formData.physicalStoreOperatingStatus === status}
                    onChange={() => setFormData((prev) => ({ ...prev, physicalStoreOperatingStatus: status }))}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{status}</span>
                </label>
              ))}
            </div>
            {errors.physicalStoreOperatingStatus && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.physicalStoreOperatingStatus}</span>
              </p>
            )}
          </div>

          {/* 22A: Apakah Lokasi Toko Memenuhi Ketentuan Penjualan Rokok Elektronik yang Berlaku? */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              22A. Apakah Lokasi Toko Memenuhi Ketentuan Penjualan Rokok Elektronik yang Berlaku? <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              (Termasuk ketentuan jarak dari satuan pendidikan, sekolah, madrasah, dan tempat bermain anak).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              {(['Ya', 'Tidak', 'Belum dapat memastikan'] as ComplianceCheck[]).map((ans) => (
                <label
                  key={ans}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.physicalStoreCompliance === ans
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="physicalStoreCompliance"
                    checked={formData.physicalStoreCompliance === ans}
                    onChange={() => setFormData((prev) => ({ ...prev, physicalStoreCompliance: ans }))}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{ans}</span>
                </label>
              ))}
            </div>
            {errors.physicalStoreCompliance && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.physicalStoreCompliance}</span>
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
