import React, { useState } from 'react';
import { Send, ArrowLeft, AlertCircle, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { FormData, FormErrors } from '../../types/form';

interface Step9Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export const Step9Confirmation: React.FC<Step9Props> = ({
  formData,
  setFormData,
  errors,
  onSubmit,
  onPrev,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
            9
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              HALAMAN 9: PERNYATAAN DAN KONFIRMASI PEMOHON
            </h2>
            <p className="text-xs text-slate-500">
              Pernyataan hukum dan konfirmasi final sebelum pengiriman formulir pendaftaran
            </p>
          </div>
        </div>

        {/* 5 Butir Pernyataan Akhir */}
        <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 rounded-2xl mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>PERNYATAAN AKHIR SEBELUM PENGIRIMAN FORMULIR</span>
          </h3>
          <p className="text-xs text-slate-600 mb-3 italic">
            Saya yang mengajukan permohonan ini menyatakan bahwa:
          </p>

          <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed list-decimal pl-5">
            <li>
              Saya adalah pemilik usaha, pengurus yang berwenang, atau pihak yang sah diberi kuasa untuk mewakili usaha yang didaftarkan.
            </li>
            <li>
              Seluruh informasi dan dokumen yang disampaikan dalam permohonan ini adalah benar dan dapat dipertanggungjawabkan keabsahannya.
            </li>
            <li>
              Saya telah membaca, memahami, dan menyetujui Ketentuan Reseller yang tercantum dalam permohonan pendaftaran.
            </li>
            <li>
              Saya memahami bahwa pengajuan ini tidak otomatis memberikan hak atau status sebagai reseller sampai diterbitkannya persetujuan tertulis resmi oleh perusahaan.
            </li>
            <li>
              Saya bersedia mengikuti proses pemeriksaan dan mempertanggungjawabkan informasi maupun tindakan saya sesuai ketentuan hukum yang berlaku.
            </li>
          </ol>
        </div>

        {/* Form Fields: 44, 45, 46 */}
        <div className="space-y-5">
          {/* 44. Nama Lengkap Pihak yang Memberikan Pernyataan */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              44. Nama Lengkap Pihak yang Memberikan Pernyataan <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Isi nama lengkap pemohon yang memiliki kewenangan untuk mengajukan permohonan ini (sesuai KTP).
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.statementSignerName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, statementSignerName: e.target.value }))
                }
                placeholder="Contoh: Hendra Wijaya"
                className={`flex-1 px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.statementSignerName
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {!formData.statementSignerName && formData.applicantName && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, statementSignerName: prev.applicantName }))
                  }
                  className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
                >
                  Salin Nama Pemohon
                </button>
              )}
            </div>
            {errors.statementSignerName && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.statementSignerName}</span>
              </p>
            )}
          </div>

          {/* 45. Pernyataan Kebenaran dan Kewenangan */}
          <div>
            <label
              className={`flex items-start space-x-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                formData.statementTruth
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.statementTruth}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, statementTruth: e.target.checked }))
                }
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-mono font-bold bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded mr-1.5">
                  45
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900">
                  Pernyataan Kebenaran dan Kewenangan <span className="text-rose-500">*</span>
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Saya menyatakan bahwa saya memiliki kewenangan yang sah untuk mengajukan permohonan ini, seluruh informasi yang saya berikan benar, dan saya memahami akibat hukum dari pernyataan yang tidak benar.
                </p>
              </div>
            </label>
            {errors.statementTruth && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.statementTruth}</span>
              </p>
            )}
          </div>

          {/* 46. Persetujuan Konfirmasi dan Verifikasi Lanjutan */}
          <div>
            <label
              className={`flex items-start space-x-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                formData.statementVerificationConsent
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.statementVerificationConsent}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    statementVerificationConsent: e.target.checked,
                  }))
                }
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-mono font-bold bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded mr-1.5">
                  46
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900">
                  Persetujuan Konfirmasi dan Verifikasi Lanjutan <span className="text-rose-500">*</span>
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Saya bersedia menerima konfirmasi melalui kontak yang didaftarkan, memberikan bukti kewenangan tambahan apabila diperlukan, dan memahami bahwa permohonan belum disetujui sebelum proses verifikasi perusahaan selesai.
                </p>
              </div>
            </label>
            {errors.statementVerificationConsent && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.statementVerificationConsent}</span>
              </p>
            )}
          </div>
        </div>

        {/* Warning Before Submission */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <strong className="text-slate-800">Konfirmasi Sebelum Pengiriman:</strong> Pastikan seluruh informasi telah diisi dengan benar. Perusahaan dapat menolak permohonan apabila terdapat dokumen yang tidak sah atau informasi yang tidak dapat diverifikasi secara faktual.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses Pengiriman...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>KIRIM PENDAFTARAN RESELLER</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
