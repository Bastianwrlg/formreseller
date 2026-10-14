import React from 'react';
import { PackageCheck, ArrowRight, ArrowLeft, AlertCircle, Info, CheckSquare } from 'lucide-react';
import { FormData, FormErrors, PurchaseSource } from '../../types/form';
import { AVAILABLE_BRANDS } from '../../data/indonesia';
import { FormPageSettings } from '../../types/formSettings';

interface Step6Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: FormPageSettings;
}

export const Step6Products: React.FC<Step6Props> = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrev,
  settings,
}) => {
  const brandList =
    settings?.halaman6?.availableBrands && settings.halaman6.availableBrands.length > 0
      ? settings.halaman6.availableBrands
      : AVAILABLE_BRANDS;
  const handleBrandToggle = (brand: string) => {
    setFormData((prev) => {
      const exists = prev.targetBrands.includes(brand);
      const nextBrands = exists
        ? prev.targetBrands.filter((b) => b !== brand)
        : [...prev.targetBrands, brand];
      return { ...prev, targetBrands: nextBrands };
    });
  };

  const handleSourceChange = (src: PurchaseSource) => {
    setFormData((prev) => {
      let defaultDistributor = prev.distributorSupplierName;
      if (src === 'Pembelian langsung dari perusahaan' && !defaultDistributor) {
        defaultDistributor = 'PT. PODA E-LIQUID COMPANY (Pusat)';
      } else if (src === 'Belum pernah melakukan pembelian') {
        defaultDistributor = 'Belum ada';
      }
      return {
        ...prev,
        purchaseSource: src,
        distributorSupplierName: defaultDistributor,
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
            6
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              HALAMAN 6: INFORMASI PRODUK DAN DISTRIBUTOR
            </h2>
            <p className="text-xs text-slate-500">
              Memastikan merek yang diajukan dan legalitas rantai pasok produk
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs sm:text-sm text-blue-900 leading-relaxed mb-6">
          <p className="font-semibold text-blue-950 mb-0.5">Petunjuk:</p>
          Bagian ini digunakan untuk mengetahui merek produk yang ingin didaftarkan serta sumber rantai pasok pembelian produk Anda guna menjamin keaslian barang di pasar.
        </div>

        <div className="space-y-6">
          {/* 31. Merek Produk yang Dimohonkan Penunjukan */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs sm:text-sm font-semibold text-slate-900">
                31. Merek Produk yang Dimohonkan Penunjukan <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Pilih minimal 1 merek
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Centang seluruh merek yang dikelola perusahaan yang ingin Anda jual secara resmi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {brandList.map((brand) => {
                const checked = formData.targetBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">{brand}</span>
                  </label>
                );
              })}
            </div>

            {formData.targetBrands.includes('Merek Lain Yang Dikelola Perusahaan') && (
              <div className="mt-3">
                <input
                  type="text"
                  value={formData.otherBrandName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, otherBrandName: e.target.value }))}
                  placeholder="Sebutkan merek lain yang dikelola perusahaan yang ingin didaftarkan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
                {errors.otherBrandName && (
                  <p className="text-xs text-rose-600 mt-1">{errors.otherBrandName}</p>
                )}
              </div>
            )}

            {errors.targetBrands && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.targetBrands}</span>
              </p>
            )}
          </div>

          {/* 32. Sumber Pembelian Produk */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              32. Sumber Pembelian Produk <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Dari mana Anda mendapatkan pasokan produk tersebut saat ini?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  'Distributor',
                  'Pembelian langsung dari perusahaan',
                  'Belum pernah melakukan pembelian',
                ] as PurchaseSource[]
              ).map((src) => (
                <label
                  key={src}
                  className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.purchaseSource === src
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="purchaseSource"
                    checked={formData.purchaseSource === src}
                    onChange={() => handleSourceChange(src)}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{src}</span>
                </label>
              ))}
            </div>
            {errors.purchaseSource && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.purchaseSource}</span>
              </p>
            )}
          </div>

          {/* 33 & 34: Nama Distributor & Kota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                33. Nama Distributor/Pemasok <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Apabila membeli langsung dari perusahaan, isi nama perusahaan. Apabila belum pernah membeli, isi &quot;Belum ada&quot;.
              </p>
              <input
                type="text"
                value={formData.distributorSupplierName}
                onChange={(e) => setFormData((prev) => ({ ...prev, distributorSupplierName: e.target.value }))}
                placeholder="Contoh: CV Distribusi Vapor Utama / Belum ada"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.distributorSupplierName
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.distributorSupplierName && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.distributorSupplierName}</span>
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-900">
                  34. Kota Distributor/Pemasok
                </label>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                  [Opsional]
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">Kota operasional distributor pemasok Anda.</p>
              <input
                type="text"
                value={formData.distributorCity}
                onChange={(e) => setFormData((prev) => ({ ...prev, distributorCity: e.target.value }))}
                placeholder="Contoh: Surabaya"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 35. Apakah Anda Bersedia Menunjukkan Bukti Pembelian Produk untuk Keperluan Verifikasi? */}
          <div className="pt-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              35. Apakah Anda Bersedia Menunjukkan Bukti Pembelian Produk untuk Keperluan Verifikasi? <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              (Berupa invoice, faktur, atau nota resmi dari distributor/perusahaan pada halaman berikutnya).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {(['Ya, bersedia', 'Tidak bersedia'] as const).map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.willingToProvideProof === opt
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="willingToProvideProof"
                    checked={formData.willingToProvideProof === opt}
                    onChange={() => setFormData((prev) => ({ ...prev, willingToProvideProof: opt }))}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{opt}</span>
                </label>
              ))}
            </div>
            {errors.willingToProvideProof && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.willingToProvideProof}</span>
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
          <span>Berikutnya (Upload Dokumen Pendukung)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
