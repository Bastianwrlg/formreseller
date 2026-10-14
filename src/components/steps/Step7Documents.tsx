import React from 'react';
import { UploadCloud, ArrowRight, ArrowLeft, Info, FileCheck } from 'lucide-react';
import { FormData, FormErrors } from '../../types/form';
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
  const isPhysicalPhotoRequired = settings?.halaman7?.requireStorePhoto ?? true;
  const isPurchaseProofRequired = settings?.halaman7?.requireInvoiceProof ?? false;
  const isPoaRequired = true;
  const maxMb = settings?.halaman7?.maxUploadSizeMb || 10;

  const needsPhysicalPhoto =
    isPhysicalPhotoRequired &&
    (formData.salesChannel === 'Toko Fisik Saja' ||
      formData.salesChannel === 'Toko Fisik dan Toko Online');

  const needsOnlineScreenshot =
    formData.salesChannel === 'Toko Online Saja' ||
    formData.salesChannel === 'Toko Fisik dan Toko Online';

  const needsPurchaseProof =
    isPurchaseProofRequired &&
    (formData.purchaseSource === 'Distributor' ||
      formData.purchaseSource === 'Pembelian langsung dari perusahaan');

  const needsPowerOfAttorney =
    isPoaRequired &&
    formData.applicantRelation === 'Penerima kuasa dari pemilik atau pengurus yang berwenang';

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
            7
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              HALAMAN 7: DOKUMEN PENDUKUNG
            </h2>
            <p className="text-xs text-slate-500">
              Mengumpulkan bukti verifikasi legalitas, fisik toko, dan rantai pasok
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs sm:text-sm text-blue-900 leading-relaxed mb-6">
          <p className="font-semibold text-blue-950 mb-0.5">Petunjuk:</p>
          Unggah dokumen yang diperlukan untuk memverifikasi identitas usaha, keberadaan toko, sumber produk, serta kewenangan pemohon. Dokumen hanya digunakan untuk keperluan pendaftaran dan verifikasi internal perusahaan.
        </div>

        {/* Security / Privacy Banner */}
        <div className="mb-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Catatan Kebijakan:</strong> Informasi harga atau data pribadi pihak ketiga yang tidak diperlukan boleh disamarkan/ditutup, selama identitas pemasok, produk, dan tanggal transaksi tetap terlihat jelas. <em>Tidak diperlukan upload KTP pada tahap awal pendaftaran ini.</em>
          </span>
        </div>

        <div className="space-y-4">
          {/* 36. Dokumen Nomor Induk Berusaha (NIB) [Wajib] */}
          <FileUploadField
            fieldNumber="36"
            label="Dokumen Nomor Induk Berusaha (NIB)"
            required
            statusBadge="Wajib"
            maxSizeMb={maxMb}
            hint="Dokumen izin NIB resmi yang diterbitkan OSS. Format PDF, JPG, atau PNG."
            file={formData.docNib}
            error={errors.docNib}
            onFileSelect={(file) => setFormData((prev) => ({ ...prev, docNib: file }))}
          />

          {/* 37. Foto Bagian Depan Toko Fisik [Kondisional] */}
          {needsPhysicalPhoto && (
            <FileUploadField
              fieldNumber="37"
              label="Foto Bagian Depan Toko Fisik"
              required
              statusBadge="Kondisional"
              maxSizeMb={maxMb}
              hint="Wajib bagi pemohon toko fisik. Pastikan papan nama toko dan fasad depan toko terlihat jelas tanpa terhalang."
              file={formData.docPhysicalStorePhoto}
              error={errors.docPhysicalStorePhoto}
              onFileSelect={(file) =>
                setFormData((prev) => ({ ...prev, docPhysicalStorePhoto: file }))
              }
            />
          )}

          {/* 38. Screenshot Profil Toko Online [Kondisional] */}
          {needsOnlineScreenshot && (
            <FileUploadField
              fieldNumber="38"
              label="Screenshot Profil Toko Online"
              required
              statusBadge="Kondisional"
              maxSizeMb={maxMb}
              hint="Wajib bagi pemohon toko online. Screenshot harus memperlihatkan nama toko dan identitas akun seller atau alamat URL toko."
              file={formData.docOnlineStoreScreenshot}
              error={errors.docOnlineStoreScreenshot}
              onFileSelect={(file) =>
                setFormData((prev) => ({ ...prev, docOnlineStoreScreenshot: file }))
              }
            />
          )}

          {/* 39. Bukti Pembelian Produk [Kondisional] */}
          {needsPurchaseProof && (
            <FileUploadField
              fieldNumber="39"
              label="Bukti Pembelian Produk (Invoice / Faktur / Nota)"
              required
              statusBadge="Kondisional"
              maxSizeMb={maxMb}
              hint="Wajib apabila pemohon menyatakan telah membeli produk. Berupa invoice, faktur pembelian, atau bukti transaksi distributor resmi yang dapat diverifikasi."
              file={formData.docPurchaseProof}
              error={errors.docPurchaseProof}
              onFileSelect={(file) => setFormData((prev) => ({ ...prev, docPurchaseProof: file }))}
            />
          )}

          {/* 40. Surat Kuasa atau Bukti Kewenangan [Kondisional] */}
          {needsPowerOfAttorney && (
            <FileUploadField
              fieldNumber="40"
              label="Surat Kuasa atau Bukti Kewenangan"
              required
              statusBadge="Kondisional"
              maxSizeMb={maxMb}
              hint="Wajib apabila pendaftaran diajukan oleh penerima kuasa / perwakilan sales yang bukan pemilik langsung."
              file={formData.docPowerOfAttorney}
              error={errors.docPowerOfAttorney}
              onFileSelect={(file) =>
                setFormData((prev) => ({ ...prev, docPowerOfAttorney: file }))
              }
            />
          )}

          {/* 41. Dokumen Pendukung Kewenangan Pengurus [Opsional / Tambahan] */}
          <FileUploadField
            fieldNumber="41"
            label="Dokumen Pendukung Kewenangan Pengurus (Akta Perusahaan / SK Kemenkumham)"
            statusBadge="Opsional"
            hint="Untuk pemohon berbadan usaha (PT/CV), unggah akta pengesahan atau penunjukan pengurus berwenang."
            file={formData.docBoardAuthority}
            error={errors.docBoardAuthority}
            onFileSelect={(file) => setFormData((prev) => ({ ...prev, docBoardAuthority: file }))}
          />
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
          <span>Berikutnya (Ketentuan Reseller & Privasi)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
