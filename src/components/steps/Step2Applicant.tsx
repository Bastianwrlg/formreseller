import React from 'react';
import { UserCheck, ArrowRight, ArrowLeft, AlertCircle, Copy } from 'lucide-react';
import { FormData, FormErrors, ApplicantRelation } from '../../types/form';
import { APPLICANT_RELATIONS } from '../../data/indonesia';

interface Step2Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2Applicant: React.FC<Step2Props> = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrev,
}) => {
  const handleRelationChange = (val: ApplicantRelation) => {
    setFormData((prev) => {
      const isOwner = val === 'Pemilik usaha perseorangan' || val === 'Direktur/pengurus badan usaha yang berwenang';
      return {
        ...prev,
        applicantRelation: val,
        // If owner and sameAsApplicant was checked, keep synced
        ...(isOwner && prev.sameAsApplicant
          ? {
              ownerName: prev.applicantName,
              ownerWhatsapp: prev.applicantWhatsapp,
              ownerEmail: prev.applicantEmail,
            }
          : {}),
      };
    });
  };

  const handleCopyApplicantToOwner = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sameAsApplicant: checked,
      ...(checked
        ? {
            ownerName: prev.applicantName,
            ownerWhatsapp: prev.applicantWhatsapp,
            ownerEmail: prev.applicantEmail,
          }
        : {}),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Title & Guidelines */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              HALAMAN 2: IDENTITAS PEMOHON
            </h2>
            <p className="text-xs text-slate-500">
              Mengidentifikasi pihak yang mengajukan permohonan pendaftaran ini
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs sm:text-sm text-blue-900 leading-relaxed mb-6">
          <p className="font-semibold text-blue-950 mb-0.5">Petunjuk:</p>
          Silakan mengisi informasi pihak yang mengajukan pendaftaran ini. Apabila Anda membantu pemilik usaha melakukan pendaftaran (misalnya sales perwakilan atau penerima kuasa), Anda harus memiliki kewenangan yang sah untuk mengajukan permohonan dan memberikan informasi kontak pemilik atau pengurus yang berwenang untuk keperluan konfirmasi.
        </div>

        {/* Section A: Data Pihak yang Mengajukan */}
        <div className="space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            A. Data Pihak Pemohon
          </h3>

          {/* Q1: Nama Lengkap Pemohon */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              1. Nama Lengkap Pemohon <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">Isi nama lengkap sesuai identitas resmi (KTP / Paspor).</p>
            <input
              type="text"
              value={formData.applicantName}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  applicantName: val,
                  ...(prev.sameAsApplicant ? { ownerName: val } : {}),
                }));
              }}
              placeholder="Contoh: Hendra Wijaya"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                errors.applicantName
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.applicantName && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.applicantName}</span>
              </p>
            )}
          </div>

          {/* Q2: Hubungan Pemohon dengan Usaha */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              2. Hubungan Pemohon dengan Usaha <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2.5 mt-2">
              {APPLICANT_RELATIONS.map((rel) => (
                <label
                  key={rel}
                  className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.applicantRelation === rel
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="applicantRelation"
                    checked={formData.applicantRelation === rel}
                    onChange={() => handleRelationChange(rel as ApplicantRelation)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{rel}</span>
                </label>
              ))}
            </div>
            {errors.applicantRelation && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.applicantRelation}</span>
              </p>
            )}
          </div>

          {/* Q3 & Q4: WhatsApp & Email Pemohon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                3. Nomor WhatsApp Pemohon <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">Gunakan nomor WhatsApp aktif untuk verifikasi.</p>
              <input
                type="tel"
                value={formData.applicantWhatsapp}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    applicantWhatsapp: val,
                    ...(prev.sameAsApplicant ? { ownerWhatsapp: val } : {}),
                  }));
                }}
                placeholder="Contoh: 081234567890"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.applicantWhatsapp
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.applicantWhatsapp && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.applicantWhatsapp}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                4. Alamat Email Pemohon <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">Email aktif untuk surat pemberitahuan.</p>
              <input
                type="email"
                value={formData.applicantEmail}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    applicantEmail: val,
                    ...(prev.sameAsApplicant ? { ownerEmail: val } : {}),
                  }));
                }}
                placeholder="Contoh: hendra@perusahaan.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.applicantEmail
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.applicantEmail && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.applicantEmail}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section B: Data Pemilik / Pengurus yang Berwenang */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                B. Data Pemilik Usaha / Pengurus yang Berwenang
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pihak yang mempunyai kewenangan penuh atas badan usaha atau toko.
              </p>
            </div>

            {/* Quick Auto-copy button */}
            <button
              type="button"
              onClick={() => handleCopyApplicantToOwner(!formData.sameAsApplicant)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                formData.sameAsApplicant
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{formData.sameAsApplicant ? '✓ Pemohon adalah Pemilik' : 'Salin dari Data Pemohon'}</span>
            </button>
          </div>

          {/* Q5: Nama Pemilik Usaha atau Pengurus */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
              5. Nama Pemilik Usaha atau Pengurus yang Berwenang <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Isi nama pihak yang mempunyai kewenangan atas usaha. Apabila Anda merupakan pihak tersebut, isi dengan nama sendiri.
            </p>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData((prev) => ({ ...prev, ownerName: e.target.value }))}
              placeholder="Contoh: Hendra Wijaya"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                errors.ownerName
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.ownerName && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.ownerName}</span>
              </p>
            )}
          </div>

          {/* Q6 & Q7: WhatsApp & Email Pemilik/Pengurus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                6. Nomor WhatsApp Pemilik/Pengurus <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Digunakan untuk konfirmasi kewenangan. Boleh sama dengan nomor pemohon.
              </p>
              <input
                type="tel"
                value={formData.ownerWhatsapp}
                onChange={(e) => setFormData((prev) => ({ ...prev, ownerWhatsapp: e.target.value }))}
                placeholder="Contoh: 081234567890"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.ownerWhatsapp
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.ownerWhatsapp && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.ownerWhatsapp}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                7. Email Pemilik/Pengurus yang Berwenang <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">Email resmi pihak yang berwenang.</p>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, ownerEmail: e.target.value }))}
                placeholder="Contoh: hendra@perusahaan.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                  errors.ownerEmail
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.ownerEmail && (
                <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.ownerEmail}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
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
          <span>Berikutnya (Identitas Usaha)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
