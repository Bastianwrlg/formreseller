import React from 'react';
import { ShieldAlert, ArrowRight, ArrowLeft, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { FormData, FormErrors } from '../../types/form';
import { FormPageSettings } from '../../types/formSettings';

interface Step8Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: FormPageSettings;
}

export const Step8Terms: React.FC<Step8Props> = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrev,
  settings,
}) => {
  const minAge = settings?.halaman8?.minimumAgeLimit || 21;
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
            8
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              HALAMAN 8: KETENTUAN RESELLER DAN PEMBERITAHUAN PRIVASI
            </h2>
            <p className="text-xs text-slate-500">
              Harap membaca seluruh ketentuan dan kebijakan hukum berikut sebelum melanjutkan
            </p>
          </div>
        </div>

        {/* 10 Ketentuan Reseller Container */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>KETENTUAN RESELLER RESMI</span>
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 max-h-72 overflow-y-auto text-xs text-slate-700 space-y-3 leading-relaxed">
            <div>
              <strong className="text-slate-900">1. Kebenaran Informasi:</strong> Pemohon wajib memberikan informasi dan dokumen yang benar, serta memiliki kewenangan yang sah untuk mendaftarkan usaha.
            </div>
            <div>
              <strong className="text-slate-900">2. Keaslian Produk:</strong> Reseller wajib menjual produk asli yang diperoleh melalui sumber yang sah dan dapat ditelusuri rantai pasoknya.
            </div>
            <div>
              <strong className="text-slate-900">3. Kepatuhan Hukum:</strong> Reseller wajib mematuhi seluruh peraturan perundang-undangan yang berlaku, termasuk perizinan usaha, ketentuan lokasi penjualan (zonasi sekolah & fasilitas anak), larangan penjualan kepada pihak yang dilarang (anak di bawah umur {minAge} tahun), dan regulasi sistem elektronik.
            </div>
            <div>
              <strong className="text-slate-900">4. Batas Kewenangan:</strong> Status reseller bersifat non-eksklusif dan tidak memberikan hak untuk bertindak sebagai distributor utama, agen tunggal, perwakilan resmi perusahaan, atau Official Store tunggal.
            </div>
            <div>
              <strong className="text-slate-900">5. Penggunaan Surat Penunjukan:</strong> Surat hanya berlaku untuk toko, lokasi, akun online, dan merek yang tercantum dalam surat. Reseller dilarang memindahtangankan, mengubah, memperjualbelikan, atau menggunakan surat untuk memberikan otorisasi kepada pihak lain.
            </div>
            <div>
              <strong className="text-slate-900">6. Penggunaan Merek:</strong> Reseller hanya diperkenankan menggunakan nama dan identitas merek sesuai ruang lingkup otorisasi yang diberikan, tanpa memperoleh hak kepemilikan atas merek tersebut.
            </div>
            <div>
              <strong className="text-slate-900">7. Tanggung Jawab Operasional:</strong> Reseller bertanggung jawab atas kegiatan usaha dan tindakan atau kelalaiannya sendiri sesuai ketentuan hukum yang berlaku. Penunjukan tidak mengalihkan kewajiban hukum yang secara langsung menjadi tanggung jawab produsen.
            </div>
            <div>
              <strong className="text-slate-900">8. Hak Perusahaan:</strong> Perusahaan berhak melakukan verifikasi, audit kepatuhan, meminta kelengkapan dokumen, menolak pengajuan, atau mencabut penunjukan apabila ditemukan pelanggaran, penyalahgunaan, atau ketidaksesuaian informasi.
            </div>
            <div>
              <strong className="text-slate-900">9. Perubahan Informasi:</strong> Reseller wajib memberitahukan perusahaan apabila terdapat perubahan pemilik usaha, alamat toko fisik, akun online, atau informasi penting lainnya.
            </div>
            <div>
              <strong className="text-slate-900">10. Status Permohonan:</strong> Pengiriman formulir ini tidak otomatis memberikan status reseller. Penunjukan hanya berlaku setelah perusahaan menerbitkan Surat Penunjukan Reseller resmi bertandatangan.
            </div>
          </div>
        </div>

        {/* Pemberitahuan Privasi Container */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            <span>PEMBERITAHUAN PRIVASI & PERLINDUNGAN DATA</span>
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 max-h-56 overflow-y-auto text-xs text-slate-700 space-y-2.5 leading-relaxed">
            <p>
              <strong>PT. PODA E-LIQUID COMPANY</strong> bertindak sebagai pengendali data pribadi yang dikumpulkan melalui formulir ini sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022). Data meliputi identitas pemohon, informasi kontak, identitas usaha, alamat toko fisik, informasi akun online, serta dokumen pendukung verifikasi.
            </p>
            <p>
              Data diproses untuk keperluan verifikasi identitas dan kewenangan, pemeriksaan legalitas usaha, evaluasi permohonan reseller, penerbitan surat otorisasi, pengawasan kepatuhan penunjukan, serta penyelesaian pengaduan dan pemenuhan kewajiban regulasi hukum.
            </p>
            <p>
              Data hanya dapat diakses oleh petugas perusahaan yang berwenang dan penyedia sistem terenkripsi yang diperlukan untuk melaksanakan tujuan tersebut. Data disimpan dengan aman selama hubungan kemitraan berlangsung dan selama masa retensi resmi yang ditetapkan peraturan perundang-undangan.
            </p>
          </div>
        </div>

        {/* Questions 42 & 43 */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <label
              className={`flex items-start space-x-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                formData.agreeTerms
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData((prev) => ({ ...prev, agreeTerms: e.target.checked }))}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-mono font-bold bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded mr-1.5">
                  42
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900">
                  Konfirmasi Pemahaman Ketentuan Reseller <span className="text-rose-500">*</span>
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  Saya telah membaca, memahami, dan menyetujui Ketentuan Reseller sebagaimana tercantum di atas.
                </p>
              </div>
            </label>
            {errors.agreeTerms && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.agreeTerms}</span>
              </p>
            )}
          </div>

          <div>
            <label
              className={`flex items-start space-x-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                formData.agreePrivacy
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.agreePrivacy}
                onChange={(e) => setFormData((prev) => ({ ...prev, agreePrivacy: e.target.checked }))}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-mono font-bold bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded mr-1.5">
                  43
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900">
                  Konfirmasi Pemberitahuan Privasi <span className="text-rose-500">*</span>
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  Saya telah membaca dan memahami Pemberitahuan Privasi, termasuk tujuan pemrosesan data dan informasi mengenai hak saya.
                </p>
              </div>
            </label>
            {errors.agreePrivacy && (
              <p className="flex items-center space-x-1 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.agreePrivacy}</span>
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
          <span>Berikutnya (Pernyataan & Konfirmasi Akhir)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
