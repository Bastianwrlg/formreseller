import React from 'react';
import { ShieldCheck, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { FormData, FormErrors } from '../../types/form';
import { FormPageSettings } from '../../types/formSettings';

interface Step1Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onNext: () => void;
  settings?: FormPageSettings;
}

export const Step1Info: React.FC<Step1Props> = ({
  formData,
  setFormData,
  errors,
  onNext,
  settings,
}) => {
  return (
    <div className="space-y-6">
      {/* Dynamic Announcement from Admin Settings */}
      {settings?.halaman1?.showAnnouncement && settings?.halaman1?.announcementNotice && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl text-amber-950 text-xs sm:text-sm shadow-xs flex items-start space-x-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900 block">Pemberitahuan Resmi Divisi Kemitraan:</span>
            <p className="text-amber-800 leading-relaxed">{settings.halaman1.announcementNotice}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Versi Formulir: 1.0 — Oktober 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            FORMULIR PENDAFTARAN RESELLER RESMI
          </h1>
          <p className="text-blue-100/90 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Selamat datang di layanan pendaftaran reseller resmi <strong className="text-white">PT. PODA E-LIQUID COMPANY</strong>. Formulir ini diperuntukkan bagi pemilik toko fisik dan/atau toko online yang ingin mengajukan <span className="text-cyan-300 font-semibold">Surat Penunjukan Reseller</span> atas produk e-liquid resmi yang diproduksi dan didistribusikan oleh perusahaan.
          </p>
        </div>
      </div>

      {/* Ketentuan Pendaftaran Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 mb-5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            KETENTUAN PENDAFTARAN
          </h2>
        </div>

        <ol className="space-y-3.5 text-xs sm:text-sm text-slate-700">
          <li className="flex items-start space-x-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">1</span>
            <span><strong>Pihak yang Mengajukan:</strong> Pendaftaran dilakukan oleh pemilik usaha, pengurus yang berwenang, atau pihak yang memperoleh kuasa yang sah.</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">2</span>
            <span><strong>Kebenaran Informasi:</strong> Pemohon wajib memberikan informasi usaha yang benar dan dokumen pendukung yang dapat diverifikasi secara faktual.</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">3</span>
            <span><strong>Batasan Pendaftaran:</strong> Satu pendaftaran berlaku untuk satu lokasi toko fisik dan paling banyak satu akun toko online.</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">4</span>
            <span><strong>Multi Cabang/Akun:</strong> Apabila memiliki beberapa cabang atau akun toko online, pemohon wajib melakukan pendaftaran tambahan terpisah.</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">5</span>
            <span><strong>Pemeriksaan Perusahaan:</strong> Seluruh permohonan akan melalui proses verifikasi data dan kepatuhan dari tim verifikasi perusahaan.</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">6</span>
            <span><strong>Bukan Status Otomatis:</strong> Pengisian formulir tidak otomatis memberikan status atau hak sebagai reseller resmi.</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">7</span>
            <span><strong>Penerbitan Surat:</strong> Surat Penunjukan Reseller hanya diterbitkan kepada pemohon yang disetujui perusahaan setelah verifikasi menyeluruh.</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">8</span>
            <span><strong>Ruang Lingkup Terbatas:</strong> Surat hanya berlaku untuk identitas toko, merek, dan saluran penjualan yang tercantum secara spesifik dalam surat.</span>
          </li>
        </ol>

        {/* Informasi Penting Alert */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start space-x-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-amber-950 mb-1">INFORMASI PENTING</p>
            <p className="leading-relaxed text-amber-900/90">
              Surat Penunjukan Reseller merupakan dokumen otorisasi terbatas dari perusahaan dan bukan izin usaha, izin penjualan produk yang dibatasi peraturan, maupun jaminan penerimaan oleh marketplace.
            </p>
            <p className="mt-2 text-xs text-amber-800">
              Layanan Bantuan & Data Pribadi: <span className="font-semibold text-amber-950">compliance@podaliquid.co.id</span>
            </p>
          </div>
        </div>

        {/* Checkbox Persetujuan Awal */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.acceptedGeneralInfo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, acceptedGeneralInfo: e.target.checked }))
              }
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
              Saya telah membaca, memahami tujuan formulir, dan bersedia mematuhi ketentuan umum pendaftaran di atas. <span className="text-rose-500">*</span>
            </span>
          </label>
          {errors.acceptedGeneralInfo && (
            <p className="text-xs text-rose-600 mt-2 font-medium">{errors.acceptedGeneralInfo}</p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <span>Mulai Pengisian Formulir</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
