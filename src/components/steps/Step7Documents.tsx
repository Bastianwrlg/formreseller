import React from 'react';
import {
  UploadCloud,
  ArrowRight,
  ArrowLeft,
  Info,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Clock,
} from 'lucide-react';
import { FormData, FormErrors, UploadedFile } from '../../types/form';
import { FormPageSettings } from '../../types/formSettings';
import { FileUploadField } from '../FileUploadField';

interface Step7Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: FormPageSettings;
}

export const Step7Documents: React.FC<Step7Props> = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrev,
  settings,
}) => {
  const isPhysicalPhotoRequired = settings?.halaman7?.requireStorePhoto ?? false;
  const isNibDocRequired = settings?.halaman7?.requireNibDoc ?? false;
  const isPurchaseProofRequired = settings?.halaman7?.requireInvoiceProof ?? false;
  const isPoaRequired = true;
  const maxMb = settings?.halaman7?.maxUploadSizeMb || 10;
  const isUploadLater = !!formData.uploadLaterConsent;

  const needsPhysicalPhoto =
    (formData.salesChannel === 'Toko Fisik Saja' ||
      formData.salesChannel === 'Toko Fisik dan Toko Online');

  const needsOnlineScreenshot =
    formData.salesChannel === 'Toko Online Saja' ||
    formData.salesChannel === 'Toko Fisik dan Toko Online';

  const needsPurchaseProof =
    formData.purchaseSource === 'Distributor' ||
    formData.purchaseSource === 'Pembelian langsung dari perusahaan';

  const needsPowerOfAttorney =
    isPoaRequired &&
    formData.applicantRelation === 'Penerima kuasa dari pemilik atau pengurus yang berwenang';

  // Helper: 1-click sample document generator for quick test
  const handleAutoFillAllSamples = () => {
    const createSample = (fieldNum: string, title: string): UploadedFile => {
      const isDocPdf = fieldNum === '36' || fieldNum === '40' || fieldNum === '41';
      const sampleName = isDocPdf
        ? `Dokumen_OSS_${fieldNum}_Reseller_PODA.pdf`
        : `Foto_Verifikasi_${fieldNum}_Reseller_PODA.jpg`;

      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="#f8fafc" stroke="#94a3b8" stroke-width="4"/>
        <rect x="30" y="30" width="540" height="70" rx="8" fill="#1e3a8a"/>
        <text x="300" y="75" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">PT. PODA E-LIQUID COMPANY</text>
        <text x="300" y="160" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">${title.toUpperCase()}</text>
        <text x="300" y="195" font-family="sans-serif" font-size="14" fill="#475569" text-anchor="middle">Nomor Berkas: BERKAS-${fieldNum}-${Date.now().toString().slice(-6)}</text>
        <text x="300" y="240" font-family="sans-serif" font-size="14" font-weight="bold" fill="#16a34a" text-anchor="middle">✓ DOKUMEN SIMULASI RESMI TERVERIFIKASI</text>
        <line x1="60" y1="280" x2="540" y2="280" stroke="#cbd5e1" stroke-width="2"/>
        <text x="300" y="320" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Diunggah untuk Otorisasi Pendaftaran Reseller Resmi PT. PODA E-LIQUID COMPANY</text>
      </svg>`;
      return {
        id: `sample_${fieldNum}_${Date.now()}`,
        name: sampleName,
        size: 135400,
        type: 'image/svg+xml',
        dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`,
        uploadedAt: new Date().toISOString(),
      };
    };

    setFormData((prev) => ({
      ...prev,
      docNib: prev.docNib || createSample('36', 'Dokumen NIB OSS'),
      docPhysicalStorePhoto:
        needsPhysicalPhoto && !prev.docPhysicalStorePhoto
          ? createSample('37', 'Foto Toko Fisik')
          : prev.docPhysicalStorePhoto,
      docOnlineStoreScreenshot:
        needsOnlineScreenshot && !prev.docOnlineStoreScreenshot
          ? createSample('38', 'Screenshot Toko Online')
          : prev.docOnlineStoreScreenshot,
      docPurchaseProof:
        needsPurchaseProof && !prev.docPurchaseProof
          ? createSample('39', 'Faktur Pembelian')
          : prev.docPurchaseProof,
      docPowerOfAttorney:
        needsPowerOfAttorney && !prev.docPowerOfAttorney
          ? createSample('40', 'Surat Kuasa')
          : prev.docPowerOfAttorney,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 flex-wrap gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              7
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                HALAMAN 7: DOKUMEN PENDUKUNG
              </h2>
              <p className="text-xs text-slate-500">
                Pilih unggah berkas sekarang atau susulkan via WhatsApp tim verifikasi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAutoFillAllSamples}
            title="Isi seluruh dokumen dengan file simulasi secara otomatis"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>⚡ Isi Otomatis Semua Dokumen (1-Klik)</span>
          </button>
        </div>

        {/* Highlight Card: Opsi Kemudahan "Susulkan Dokumen Nanti" */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all mb-5 ${
            isUploadLater
              ? 'bg-emerald-50/90 border-emerald-500 shadow-xs'
              : 'bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border-blue-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isUploadLater ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {isUploadLater ? <CheckCircle2 className="w-5 h-5" /> : <PhoneCall className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Opsi Kemudahan: Susulkan Dokumen Nanti via WhatsApp
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isUploadLater
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {isUploadLater ? 'Aktif: Boleh Tanpa Upload' : 'Bebas Hambatan'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Belum memiliki file di ponsel/komputer saat ini? Anda tetap dapat melanjutkan pendaftaran dan mengirimkan foto/dokumen melalui WhatsApp saat dihubungi oleh Tim Verifikasi PT. PODA E-LIQUID COMPANY.
                </p>
              </div>
            </div>

            <label className="shrink-0 flex items-center space-x-2 cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-300 hover:border-blue-500 shadow-2xs self-start sm:self-center">
              <input
                type="checkbox"
                checked={isUploadLater}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, uploadLaterConsent: e.target.checked }))
                }
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800">
                {isUploadLater ? '✓ Dokumen Disusulkan Nanti' : 'Pilih Opsi Susulkan Nanti'}
              </span>
            </label>
          </div>
        </div>

        {/* Security / Privacy Banner */}
        <div className="mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Catatan Kebijakan:</strong> Informasi harga pada faktur boleh disamarkan/ditutup, selama identitas pemasok, produk, dan tanggal transaksi tetap terlihat jelas. <em>Tidak diperlukan upload KTP pada tahap awal pendaftaran ini.</em>
          </span>
        </div>

        {/* Error Callout if any required document is missing (only shown if user hasn't opted to upload later) */}
        {!isUploadLater && Object.keys(errors).length > 0 && (
          <div className="mb-5 p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start justify-between gap-3 text-xs sm:text-sm text-rose-900 shadow-sm animate-in fade-in">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-rose-950 block text-sm">
                  Beberapa Dokumen Belum Terunggah
                </span>
                <p className="text-xs text-rose-700">
                  Anda dapat mengunggah file sekarang, menggunakan tombol <strong>Contoh Otomatis (1-Klik)</strong> di tiap kotak, atau klik tombol di sebelah kanan untuk menyusulkan lewat WhatsApp:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-rose-800 text-xs mt-1">
                  {errors.docNib && <li>{errors.docNib}</li>}
                  {errors.docPhysicalStorePhoto && <li>{errors.docPhysicalStorePhoto}</li>}
                  {errors.docOnlineStoreScreenshot && <li>{errors.docOnlineStoreScreenshot}</li>}
                  {errors.docPurchaseProof && <li>{errors.docPurchaseProof}</li>}
                  {errors.docPowerOfAttorney && <li>{errors.docPowerOfAttorney}</li>}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, uploadLaterConsent: true }));
                setTimeout(() => onNext(), 50);
              }}
              className="shrink-0 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors self-start cursor-pointer"
            >
              Susulkan via WA &amp; Lanjut
            </button>
          </div>
        )}

        <div className="space-y-4">
          {/* 36. Dokumen Nomor Induk Berusaha (NIB) */}
          <FileUploadField
            fieldNumber="36"
            label="Dokumen Nomor Induk Berusaha (NIB)"
            required={!isUploadLater && isNibDocRequired}
            statusBadge={isUploadLater ? 'Opsional' : isNibDocRequired ? 'Wajib' : 'Opsional'}
            maxSizeMb={maxMb}
            hint="Dokumen izin NIB resmi yang diterbitkan OSS. Format PDF, JPG, atau PNG."
            file={formData.docNib}
            error={!isUploadLater ? errors.docNib : undefined}
            onFileSelect={(file) => setFormData((prev) => ({ ...prev, docNib: file }))}
          />

          {/* 37. Foto Bagian Depan Toko Fisik */}
          {needsPhysicalPhoto && (
            <FileUploadField
              fieldNumber="37"
              label="Foto Bagian Depan Toko Fisik"
              required={!isUploadLater && isPhysicalPhotoRequired}
              statusBadge={isUploadLater ? 'Opsional' : isPhysicalPhotoRequired ? 'Kondisional' : 'Opsional'}
              maxSizeMb={maxMb}
              hint="Foto tampak depan gerai/toko fisik dengan papan nama toko yang terlihat jelas."
              file={formData.docPhysicalStorePhoto}
              error={!isUploadLater ? errors.docPhysicalStorePhoto : undefined}
              onFileSelect={(file) =>
                setFormData((prev) => ({ ...prev, docPhysicalStorePhoto: file }))
              }
            />
          )}

          {/* 38. Screenshot Profil Toko Online */}
          {needsOnlineScreenshot && (
            <FileUploadField
              fieldNumber="38"
              label="Screenshot Profil Toko Online"
              required={!isUploadLater}
              statusBadge={isUploadLater ? 'Opsional' : 'Kondisional'}
              maxSizeMb={maxMb}
              hint="Screenshot profil toko online memperlihatkan nama toko, username seller, atau URL toko."
              file={formData.docOnlineStoreScreenshot}
              error={!isUploadLater ? errors.docOnlineStoreScreenshot : undefined}
              onFileSelect={(file) =>
                setFormData((prev) => ({ ...prev, docOnlineStoreScreenshot: file }))
              }
            />
          )}

          {/* 39. Bukti Pembelian Produk */}
          {needsPurchaseProof && (
            <FileUploadField
              fieldNumber="39"
              label="Bukti Pembelian Produk (Invoice / Faktur / Nota)"
              required={!isUploadLater && isPurchaseProofRequired}
              statusBadge={isUploadLater ? 'Opsional' : isPurchaseProofRequired ? 'Wajib' : 'Opsional'}
              maxSizeMb={maxMb}
              hint="Faktur pembelian, invoice resmi, atau bukti transaksi dari distributor terdaftar."
              file={formData.docPurchaseProof}
              error={!isUploadLater ? errors.docPurchaseProof : undefined}
              onFileSelect={(file) => setFormData((prev) => ({ ...prev, docPurchaseProof: file }))}
            />
          )}

          {/* 40. Surat Kuasa atau Bukti Kewenangan */}
          {needsPowerOfAttorney && (
            <FileUploadField
              fieldNumber="40"
              label="Surat Kuasa atau Bukti Kewenangan"
              required={!isUploadLater}
              statusBadge={isUploadLater ? 'Opsional' : 'Kondisional'}
              maxSizeMb={maxMb}
              hint="Diunggah apabila pendaftaran diajukan oleh perwakilan kuasa yang bukan pemilik langsung."
              file={formData.docPowerOfAttorney}
              error={!isUploadLater ? errors.docPowerOfAttorney : undefined}
              onFileSelect={(file) =>
                setFormData((prev) => ({ ...prev, docPowerOfAttorney: file }))
              }
            />
          )}

          {/* 41. Dokumen Pendukung Kewenangan Pengurus */}
          <FileUploadField
            fieldNumber="41"
            label="Dokumen Pendukung Kewenangan Pengurus (Akta Perusahaan / SK Kemenkumham)"
            statusBadge="Opsional"
            hint="Untuk pemohon berbadan usaha (PT/CV), akta pengesahan atau penunjukan pengurus berwenang."
            file={formData.docBoardAuthority}
            error={errors.docBoardAuthority}
            onFileSelect={(file) => setFormData((prev) => ({ ...prev, docBoardAuthority: file }))}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <div className="w-full sm:w-auto flex items-center space-x-2">
          {!isUploadLater && (
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, uploadLaterConsent: true }));
                setTimeout(() => onNext(), 50);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Susulkan Berkas via WA &amp; Lanjut</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Berikutnya (Syarat &amp; Privasi)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
