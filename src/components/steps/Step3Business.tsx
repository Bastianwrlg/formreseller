import React from 'react';
import { Building2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { FormData, FormErrors, BusinessType } from '../../types/form';
import { BUSINESS_TYPES, INDONESIA_PROVINCES } from '../../data/indonesia';

interface Step3Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3Business: React.FC<Step3Props> = ({
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
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              HALAMAN 3: IDENTITAS USAHA
            </h2>
            <p className="text-xs text-slate-500">
              Memastikan identitas dan legalitas badan usaha/toko pemohon
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs sm:text-sm text-blue-900 leading-relaxed mb-6">
          <p className="font-semibold text-blue-950 mb-0.5">Petunjuk:</p>
          Isi sesuai identitas usaha dan dokumen legalitas resmi yang berlaku di Republik Indonesia (NIB, Akta Pendirian, atau SK Kemenkumham).
        </div>

        <div className="space-y-5">
          {/* Q8: Nama Toko atau Nama Dagang */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              8. Nama Toko atau Nama Dagang <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">Nama brand/merek toko Anda yang dikenal pelanggan (Contoh: ABC Vape Store).</p>
            <input
              type="text"
              value={formData.businessTradeName}
              onChange={(e) => setFormData((prev) => ({ ...prev, businessTradeName: e.target.value }))}
              placeholder="Contoh: ABC Vape Store Sudirman"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                errors.businessTradeName
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.businessTradeName && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.businessTradeName}</span>
              </p>
            )}
          </div>

          {/* Q9: Bentuk Usaha */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              9. Bentuk Usaha <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
              {BUSINESS_TYPES.map((type) => (
                <label
                  key={type}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.businessType === type
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="businessType"
                    checked={formData.businessType === type}
                    onChange={() => setFormData((prev) => ({ ...prev, businessType: type as BusinessType }))}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{type}</span>
                </label>
              ))}
            </div>

            {formData.businessType === 'Bentuk usaha lainnya' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={formData.businessTypeOther}
                  onChange={(e) => setFormData((prev) => ({ ...prev, businessTypeOther: e.target.value }))}
                  placeholder="Sebutkan bentuk badan usaha lainnya (misal: Yayasan, Firma)..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
                {errors.businessTypeOther && (
                  <p className="text-xs text-rose-600 mt-1">{errors.businessTypeOther}</p>
                )}
              </div>
            )}

            {errors.businessType && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.businessType}</span>
              </p>
            )}
          </div>

          {/* Q10: Nama Pemilik Usaha/Badan Usaha */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              10. Nama Pemilik Usaha/Badan Usaha <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Untuk usaha perseorangan, isi nama pemilik. Untuk badan usaha, isi nama resmi sesuai dokumen legalitas (contoh: PT ABC Retail Jaya).
            </p>
            <input
              type="text"
              value={formData.businessLegalName}
              onChange={(e) => setFormData((prev) => ({ ...prev, businessLegalName: e.target.value }))}
              placeholder="Contoh: PT ABC Retail Jaya / UD Maju Terus"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                errors.businessLegalName
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.businessLegalName && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.businessLegalName}</span>
              </p>
            )}
          </div>

          {/* Q11: Nomor Induk Berusaha (NIB) */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              11. Nomor Induk Berusaha (NIB) <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Isi nomor sesuai dokumen NIB usaha yang terdaftar di OSS (13 digit angka).
            </p>
            <input
              type="text"
              maxLength={13}
              value={formData.nibNumber}
              onChange={(e) => {
                // only numbers
                const val = e.target.value.replace(/\D/g, '');
                setFormData((prev) => ({ ...prev, nibNumber: val }));
              }}
              placeholder="13 digit angka (contoh: 1234567890123)"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-hidden focus:ring-2 ${
                errors.nibNumber
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.nibNumber ? (
                <p className="flex items-center space-x-1 text-xs text-rose-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.nibNumber}</span>
                </p>
              ) : (
                <span />
              )}
              <span className="text-[11px] text-slate-400 font-mono">
                {formData.nibNumber.length}/13 digit
              </span>
            </div>
          </div>

          {/* Q12: Alamat Usaha Terdaftar */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              12. Alamat Usaha Terdaftar <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Isi alamat usaha sesuai dokumen legalitas atau alamat usaha yang tercatat secara resmi.
            </p>
            <textarea
              rows={3}
              value={formData.registeredAddress}
              onChange={(e) => setFormData((prev) => ({ ...prev, registeredAddress: e.target.value }))}
              placeholder="Contoh: Jl. Gatot Subroto Kav. 18, RT 01/RW 03, Kel. Kuningan Barat, Kec. Mampang Prapatan"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                errors.registeredAddress
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.registeredAddress && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.registeredAddress}</span>
              </p>
            )}
          </div>

          {/* Q13 & Q14: Kota/Kabupaten & Provinsi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                13. Kota/Kabupaten <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="Contoh: Jakarta Selatan"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.city
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.city && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.city}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                14. Provinsi <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.province}
                onChange={(e) => setFormData((prev) => ({ ...prev, province: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all bg-white focus:outline-hidden focus:ring-2 ${
                  errors.province
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              >
                <option value="">-- Pilih Provinsi (38 Provinsi di Indonesia) --</option>
                {INDONESIA_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.province}</span>
                </p>
              )}
            </div>
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
          <span>Berikutnya (Jenis Saluran Penjualan)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
