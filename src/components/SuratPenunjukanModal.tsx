import React from 'react';
import { X, Printer, ShieldCheck, Award, Building, CheckCircle2 } from 'lucide-react';
import { FormData, FormSettings } from '../types/form';

interface SuratPenunjukanModalProps {
  application: FormData;
  onClose: () => void;
  settings?: FormSettings;
}

export const SuratPenunjukanModal: React.FC<SuratPenunjukanModalProps> = ({
  application,
  onClose,
  settings,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const letterDate = new Date(application.reviewedAt || application.updatedAt).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  const prefix = settings?.registrationPrefix || 'SPR';
  const letterNumber = `${prefix}/${new Date().getFullYear()}/${application.registrationNumber?.replace('REG-', '') || '0928'}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Action Header (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-800">
              Pratinjau Surat Penunjukan Reseller Resmi
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Surat (PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body (Standard Official Letter Format) */}
        <div className="p-8 sm:p-12 overflow-y-auto text-slate-800 font-serif leading-relaxed text-xs sm:text-sm">
          {/* Company Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-sans font-extrabold tracking-wider text-slate-900 uppercase">
                {settings?.companyName || 'PT. PODA E-LIQUID COMPANY'}
              </h1>
              <p className="text-xs font-sans text-slate-600 mt-0.5">
                {settings?.companyTagline || 'Official E-Liquid Manufacturer & Authorized Distribution Network'}
              </p>
              <p className="text-[11px] font-sans text-slate-500">
                {settings?.companyAddress || 'PODA Industrial Park, Sentra Niaga E-Liquid Indonesia'} | Email: {settings?.complianceEmail || 'legal@podaliquid.co.id'}
              </p>
            </div>
            <div className="text-right shrink-0 ml-4 font-sans hidden sm:block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                TERVERIFIKASI RESMI
              </span>
            </div>
          </div>

          {/* Letter Title */}
          <div className="text-center my-6">
            <h2 className="text-base sm:text-lg font-sans font-bold underline uppercase tracking-wide">
              SURAT PENUNJUKAN RESELLER RESMI
            </h2>
            <p className="text-xs font-sans text-slate-600 mt-1 font-mono">
              Nomor: {letterNumber}
            </p>
          </div>

          <div className="space-y-4">
            <p>Dengan ini, PT. PODA E-LIQUID COMPANY menerangkan bahwa:</p>

            <table className="w-full text-xs sm:text-sm font-sans my-3 border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 pr-4 font-semibold text-slate-600 w-44">Nama Toko / Dagang</td>
                  <td className="py-1.5 font-bold text-slate-900">{application.businessTradeName}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 pr-4 font-semibold text-slate-600">Badan Usaha / Pemilik</td>
                  <td className="py-1.5 text-slate-800">{application.businessLegalName} ({application.businessType})</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 pr-4 font-semibold text-slate-600">Nomor Induk Berusaha (NIB)</td>
                  <td className="py-1.5 font-mono text-slate-900">{application.nibNumber}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 pr-4 font-semibold text-slate-600">Saluran Penjualan</td>
                  <td className="py-1.5 text-slate-800">{application.salesChannel}</td>
                </tr>
                {application.physicalStoreAddress && (
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 pr-4 font-semibold text-slate-600">Lokasi Toko Fisik</td>
                    <td className="py-1.5 text-slate-800">{application.physicalStoreAddress}</td>
                  </tr>
                )}
                {application.onlineStoreUrl && (
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 pr-4 font-semibold text-slate-600">Toko Online / Platform</td>
                    <td className="py-1.5 text-slate-800">
                      {application.onlineStorePlatform} - {application.onlineStoreUrl}
                    </td>
                  </tr>
                )}
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 pr-4 font-semibold text-slate-600">Merek yang Diotorisasi</td>
                  <td className="py-1.5 font-semibold text-blue-900">
                    {application.targetBrands?.join(', ') || '-'}
                  </td>
                </tr>
              </tbody>
            </table>

            <p>
              Telah memenuhi seluruh kriteria verifikasi legalitas, keaslian sumber produk, serta ketentuan zonasi dan kepatuhan penjualan sesuai standar perusahaan. Oleh karenanya, pihak yang bersangkutan secara sah ditunjuk sebagai <strong>RESELLER RESMI</strong> untuk mendistribusikan produk-produk merek tersebut di atas sesuai saluran penjualan yang tercantum.
            </p>

            <p>
              Ketentuan Surat Penunjukan:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-700 font-sans">
              <li>Surat ini hanya berlaku khusus untuk identitas toko, saluran penjualan, dan merek yang tertera di atas.</li>
              <li>Surat ini bukan merupakan jaminan kredit atau pengalihan tanggung jawab hukum produk produsen.</li>
              <li>Masa berlaku surat penunjukan adalah 1 (satu) tahun sejak tanggal diterbitkan, dan dapat dievaluasi secara berkala.</li>
            </ol>

            {/* Signature Section */}
            <div className="mt-8 pt-6 flex justify-between items-end font-sans">
              <div className="text-xs text-slate-500">
                <p>Nomor Registrasi Sistem: <span className="font-mono text-slate-800">{application.registrationNumber}</span></p>
                <p>Status: <span className="text-emerald-700 font-bold">Disetujui Divisi Kemitraan</span></p>
                <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-lg inline-block">
                  <span className="text-[10px] text-slate-400 font-mono block">QR Otentikasi Digital</span>
                  <div className="w-16 h-16 bg-slate-200 rounded flex items-center justify-center text-[10px] text-slate-500 font-mono">
                    [QR VALID]
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-600">Jakarta, {letterDate}</p>
                <p className="text-xs font-semibold text-slate-900 mt-1">{settings?.companyName || 'PT. PODA E-LIQUID COMPANY'}</p>
                <div className="h-16 flex items-center justify-end">
                  <span className="text-emerald-800 font-serif italic text-sm border-2 border-emerald-600 px-3 py-1 rounded-sm rotate-[-4deg] opacity-85">
                    TERVERIFIKASI & OTORISASI
                  </span>
                </div>
                <p className="text-xs font-bold underline text-slate-900">
                  {application.reviewedBy || settings?.letterSignerName || 'Direktur Kemitraan & Legal'}
                </p>
                <p className="text-[11px] text-slate-500">{settings?.letterSignerRole || 'Divisi Otorisasi Reseller & Kemitraan'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
