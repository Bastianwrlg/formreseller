import React from 'react';
import { Share2, Store, Globe, Layers, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { FormData, FormErrors, SalesChannel } from '../../types/form';

interface Step4Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
}

export const Step4Channel: React.FC<Step4Props> = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrev,
}) => {
  const channels: {
    value: SalesChannel;
    title: string;
    description: string;
    icon: typeof Store;
    badge: string;
    routeInfo: string;
  }[] = [
    {
      value: 'Toko Fisik Saja',
      title: 'Toko Fisik Saja',
      description: 'Hanya memiliki gerai toko offline / retail fisik (misal toko di ruko, mall, atau sentra niaga).',
      icon: Store,
      badge: 'Alur Halaman 5A',
      routeInfo: 'Lanjut ke HALAMAN 5A (Informasi Toko Fisik)',
    },
    {
      value: 'Toko Online Saja',
      title: 'Toko Online Saja',
      description: 'Hanya berjualan melalui platform e-commerce, marketplace (Shopee, Tokopedia, TikTok Shop) atau website toko sendiri.',
      icon: Globe,
      badge: 'Alur Halaman 5B',
      routeInfo: 'Lanjut ke HALAMAN 5B (Informasi Toko Online)',
    },
    {
      value: 'Toko Fisik dan Toko Online',
      title: 'Toko Fisik dan Toko Online',
      description: 'Memiliki gerai toko fisik sekaligus mengoperasikan toko daring/online resmi.',
      icon: Layers,
      badge: 'Alur Halaman 5C',
      routeInfo: 'Lanjut ke HALAMAN 5C (Informasi Toko Fisik & Online)',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
            4
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              HALAMAN 4: JENIS SALURAN PENJUALAN
            </h2>
            <p className="text-xs text-slate-500">
              Menentukan apakah permohonan untuk toko fisik, online, atau keduanya
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs sm:text-sm text-blue-900 leading-relaxed mb-6">
          <p className="font-semibold text-blue-950 mb-0.5">Petunjuk:</p>
          Pilih jenis saluran penjualan yang akan didaftarkan untuk memperoleh Surat Penunjukan Reseller. Sistem akan secara otomatis mengarahkan formulir ke halaman pengisian spesifik berdasarkan pilihan saluran Anda.
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
            15. Jenis Saluran Penjualan <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-4">
            Pilih salah satu dari 3 kategori berikut:
          </p>

          <div className="grid grid-cols-1 gap-3.5">
            {channels.map((ch) => {
              const isSelected = formData.salesChannel === ch.value;
              const Icon = ch.icon;

              return (
                <div
                  key={ch.value}
                  onClick={() => setFormData((prev) => ({ ...prev, salesChannel: ch.value }))}
                  className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm scale-[1.005]'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            {ch.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {ch.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {ch.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-3 mt-1">
                      <input
                        type="radio"
                        name="salesChannel"
                        checked={isSelected}
                        onChange={() => setFormData((prev) => ({ ...prev, salesChannel: ch.value }))}
                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Pengaturan Sistem:</span>
                    <span className="text-blue-700 font-semibold">{ch.routeInfo}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {errors.salesChannel && (
            <p className="flex items-center space-x-1 text-xs text-rose-600 mt-3">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.salesChannel}</span>
            </p>
          )}
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
          <span>
            {formData.salesChannel === 'Toko Fisik Saja'
              ? 'Lanjut ke Hal 5A (Toko Fisik)'
              : formData.salesChannel === 'Toko Online Saja'
              ? 'Lanjut ke Hal 5B (Toko Online)'
              : formData.salesChannel === 'Toko Fisik dan Toko Online'
              ? 'Lanjut ke Hal 5C (Fisik & Online)'
              : 'Berikutnya (Halaman 5)'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
