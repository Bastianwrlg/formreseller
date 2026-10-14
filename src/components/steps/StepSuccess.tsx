import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  FileCheck,
  Printer,
  PlusCircle,
  ExternalLink,
  Building,
  Store,
  User,
  Phone,
  Mail,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';
import { FormData } from '../../types/form';

interface StepSuccessProps {
  formData: FormData;
  onNewRegistration: () => void;
  onOpenAdmin: () => void;
}

export const StepSuccess: React.FC<StepSuccessProps> = ({
  formData,
  onNewRegistration,
  onOpenAdmin,
}) => {
  useEffect(() => {
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Success Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
          Halaman Setelah Submit
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          PENDAFTARAN BERHASIL DIKIRIM
        </h1>

        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
          Terima kasih. Permohonan pendaftaran reseller Anda telah berhasil dikirim dan tersimpan di database sistem. Permohonan akan segera diproses melalui tahapan verifikasi perusahaan.
        </p>

        {/* Ticket Box */}
        <div className="mt-6 inline-block bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Nomor Registrasi Permohonan
          </p>
          <p className="text-xl sm:text-2xl font-mono font-bold text-blue-700 mt-1 select-all">
            {formData.registrationNumber || 'REG-202610-8812'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Simpan nomor registrasi ini untuk melacak status verifikasi otorisasi Anda.
          </p>
        </div>
      </div>

      {/* Ringkasan Pengajuan (Printable) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 print:border-none print:shadow-none">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Ringkasan Data Permohonan
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {new Date(formData.updatedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="space-y-1 p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 text-xs font-medium block">Nama Toko / Nama Dagang</span>
            <span className="font-bold text-slate-900">{formData.businessTradeName || '-'}</span>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 text-xs font-medium block">Nomor Induk Berusaha (NIB)</span>
            <span className="font-mono font-bold text-slate-900">{formData.nibNumber || '-'}</span>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 text-xs font-medium block">Bentuk Usaha / Badan Usaha</span>
            <span className="font-medium text-slate-800">
              {formData.businessType} ({formData.businessLegalName || '-'})
            </span>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 text-xs font-medium block">Jenis Saluran Penjualan</span>
            <span className="font-semibold text-blue-700">{formData.salesChannel || '-'}</span>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 text-xs font-medium block">Nama Pemohon & WhatsApp</span>
            <span className="font-medium text-slate-800">
              {formData.applicantName} ({formData.applicantWhatsapp})
            </span>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 text-xs font-medium block">Merek Produk yang Dimohonkan</span>
            <span className="font-medium text-slate-800">
              {formData.targetBrands?.join(', ') || '-'}
            </span>
          </div>
        </div>

        {/* Info Legal Notes */}
        <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
          <p className="font-bold mb-1">Pemberitahuan Resmi PT. PODA E-LIQUID COMPANY:</p>
          Pengiriman formulir bukan merupakan persetujuan penunjukan reseller secara otomatis. Apabila diperlukan, divisi kemitraan PT. PODA E-LIQUID COMPANY akan menghubungi pemohon atau pemilik usaha melalui kontak yang didaftarkan. Surat Penunjukan Reseller resmi hanya diterbitkan setelah seluruh berkas diverifikasi dan disetujui perusahaan.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Bukti Registrasi</span>
        </button>

        <button
          type="button"
          onClick={onOpenAdmin}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Buka Portal Sales & Admin Verifikasi</span>
        </button>

        <button
          type="button"
          onClick={onNewRegistration}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Pendaftaran Baru</span>
        </button>
      </div>
    </div>
  );
};
