import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Layers,
  FileText,
  Building,
  Store,
  Package,
  FileUp,
  ShieldAlert,
  Plus,
  Trash2,
} from 'lucide-react';
import { FormPageSettings, DEFAULT_FORM_SETTINGS } from '../types/formSettings';
import { apiGetFormSettings, apiSaveFormSettings } from '../services/api';

export const AdminFormSettings: React.FC = () => {
  const [settings, setSettings] = useState<FormPageSettings>(DEFAULT_FORM_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('hal1');
  const [newBrandInput, setNewBrandInput] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await apiGetFormSettings();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    const res = await apiSaveFormSettings(settings);
    setSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const handleResetDefault = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mengembalikan seluruh pengaturan formulir ke standar default PT. PODA E-LIQUID COMPANY?'
      )
    ) {
      setSettings(DEFAULT_FORM_SETTINGS);
    }
  };

  const handleAddBrand = () => {
    if (!newBrandInput.trim()) return;
    setSettings((prev) => ({
      ...prev,
      halaman6: {
        ...prev.halaman6,
        availableBrands: [...prev.halaman6.availableBrands, newBrandInput.trim()],
      },
    }));
    setNewBrandInput('');
  };

  const handleRemoveBrand = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      halaman6: {
        ...prev.halaman6,
        availableBrands: prev.halaman6.availableBrands.filter((_, i) => i !== index),
      },
    }));
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
        Memuat konfigurasi formulir...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 bg-indigo-100 text-indigo-800 rounded-xl">
              <Settings className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Pengaturan Formulir Pendaftaran Per Halaman
              </h2>
              <p className="text-xs text-slate-500">
                Konfigurasi aktif langsung tersinkronisasi ke seluruh pendaftar (Halaman 1 s/d 9)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center space-x-2 text-emerald-800 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Pengaturan Berhasil Disimpan!</strong> Formulir pendaftaran kini menggunakan konfigurasi terbaru dan telah disiarkan secara real-time.
          </span>
        </div>
      )}

      {/* Navigation Tabs per Page */}
      <div className="flex overflow-x-auto gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
        {[
          { id: 'hal1', label: 'Hal 1: Ketentuan', icon: FileText },
          { id: 'hal2', label: 'Hal 2: Pemohon', icon: Layers },
          { id: 'hal3', label: 'Hal 3: Badan Usaha', icon: Building },
          { id: 'hal4', label: 'Hal 4 & 5: Saluran & Toko', icon: Store },
          { id: 'hal6', label: 'Hal 6: Merek PODA', icon: Package },
          { id: 'hal7', label: 'Hal 7: Dokumen', icon: FileUp },
          { id: 'hal8', label: 'Hal 8 & 9: SOP & Pakta', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Form Settings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* TAB 1: HALAMAN 1 */}
        {activeTab === 'hal1' && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Konfigurasi Halaman 1: Ketentuan Umum & Pengumuman
              </h3>
              <p className="text-xs text-slate-500">
                Atur pesan pengumuman pembukaan registrasi dan kontak compliance resmi.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Tampilkan Pengumuman di Atas Halaman 1</span>
                <span className="text-[11px] text-slate-500">Menampilkan kotak informasi resmi di awal formulir</span>
              </div>
              <input
                type="checkbox"
                checked={settings.halaman1.showAnnouncement}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    halaman1: { ...prev.halaman1, showAnnouncement: e.target.checked },
                  }))
                }
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Teks Pengumuman Pendaftaran
              </label>
              <textarea
                rows={3}
                value={settings.halaman1.announcementNotice}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    halaman1: { ...prev.halaman1, announcementNotice: e.target.value },
                  }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Email Bantuan Compliance
                </label>
                <input
                  type="email"
                  value={settings.halaman1.supportEmail}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      halaman1: { ...prev.halaman1, supportEmail: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Nomor Kontak / WhatsApp Kemitraan
                </label>
                <input
                  type="text"
                  value={settings.halaman1.supportPhone}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      halaman1: { ...prev.halaman1, supportPhone: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HALAMAN 2 */}
        {activeTab === 'hal2' && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Konfigurasi Halaman 2: Informasi Pemohon & Pemilik
              </h3>
              <p className="text-xs text-slate-500">
                Batasi kewenangan pengisian oleh pihak luar atau delegasi surat kuasa.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Izinkan Hubungan &quot;Penerima Kuasa&quot;</span>
                <span className="text-[11px] text-slate-500">
                  Jika dimatikan, hanya pemilik atau direksi resmi yang dapat mengisi formulir.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.halaman2.allowPowerOfAttorney}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    halaman2: { ...prev.halaman2, allowPowerOfAttorney: e.target.checked },
                  }))
                }
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>
          </div>
        )}

        {/* TAB 3: HALAMAN 3 */}
        {activeTab === 'hal3' && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Konfigurasi Halaman 3: Legalitas & Nomor NIB
              </h3>
              <p className="text-xs text-slate-500">
                Atur aturan validasi nomor izin berusaha NIB OSS.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">NIB OSS Wajib Diisi</span>
                <span className="text-[11px] text-slate-500">
                  Standar kepatuhan hukum: pendaftar wajib memiliki NIB terdaftar
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.halaman3.nibRequired}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    halaman3: { ...prev.halaman3, nibRequired: e.target.checked },
                  }))
                }
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Standar Panjang Digit NIB OSS
              </label>
              <input
                type="number"
                min={8}
                max={20}
                value={settings.halaman3.nibDigitLength}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    halaman3: { ...prev.halaman3, nibDigitLength: parseInt(e.target.value) || 13 },
                  }))
                }
                className="w-32 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <span className="text-[11px] text-slate-500 ml-2">(Default: 13 digit)</span>
            </div>
          </div>
        )}

        {/* TAB 4: HALAMAN 4 & 5 */}
        {activeTab === 'hal4' && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Konfigurasi Halaman 4 & 5: Saluran Penjualan & Kepatuhan Lokasi
              </h3>
              <p className="text-xs text-slate-500">
                Pilih saluran penjualan yang sedang dibuka atau ditutup sementara.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-800">Buka Saluran: Toko Fisik Saja (5A)</span>
                <input
                  type="checkbox"
                  checked={settings.halaman4.allowPhysicalOnly}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      halaman4: { ...prev.halaman4, allowPhysicalOnly: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-800">Buka Saluran: Toko Online Saja (5B)</span>
                <input
                  type="checkbox"
                  checked={settings.halaman4.allowOnlineOnly}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      halaman4: { ...prev.halaman4, allowOnlineOnly: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-800">Buka Saluran: Toko Fisik dan Toko Online (5C)</span>
                <input
                  type="checkbox"
                  checked={settings.halaman4.allowBothPhysicalOnline}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      halaman4: { ...prev.halaman4, allowBothPhysicalOnline: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-2">Validasi Kepatuhan Khusus (Halaman 5):</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-700">Wajibkan Verifikasi Jarak Zonasi Sekolah (&gt;200 meter)</span>
                  <input
                    type="checkbox"
                    checked={settings.halaman5.enforceSchoolZoning}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        halaman5: { ...prev.halaman5, enforceSchoolZoning: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-700">Wajibkan Sistem Verifikasi Usia 21+ pada Toko Online</span>
                  <input
                    type="checkbox"
                    checked={settings.halaman5.enforceAgeVerification}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        halaman5: { ...prev.halaman5, enforceAgeVerification: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HALAMAN 6 */}
        {activeTab === 'hal6' && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Konfigurasi Halaman 6: Daftar Lini Produk Resmi PODA
              </h3>
              <p className="text-xs text-slate-500">
                Tambah atau hapus varian merek produk yang dapat dimohonkan oleh reseller.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                Daftar Merek yang Ditampilkan di Formulir ({settings.halaman6.availableBrands.length}):
              </label>
              <div className="space-y-2">
                {settings.halaman6.availableBrands.map((brand, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <span className="text-xs font-medium text-slate-800">{brand}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBrand(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Hapus merek ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Brand */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="text"
                  value={newBrandInput}
                  onChange={(e) => setNewBrandInput(e.target.value)}
                  placeholder="Ketik nama seri/lini produk baru..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddBrand}
                  className="inline-flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-800">
                Izinkan Opsi &quot;Merek Lain Yang Dikelola PT. PODA E-LIQUID COMPANY&quot;
              </span>
              <input
                type="checkbox"
                checked={settings.halaman6.allowOtherBrandOption}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    halaman6: { ...prev.halaman6, allowOtherBrandOption: e.target.checked },
                  }))
                }
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>
          </div>
        )}

        {/* TAB 6: HALAMAN 7 */}
        {activeTab === 'hal7' && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Konfigurasi Halaman 7: Dokumen Pendukung & Ukuran Unggah
              </h3>
              <p className="text-xs text-slate-500">
                Tentukan berkas mana yang bersifat wajib atau opsional.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Wajibkan Faktur / Bukti Pembelian Produk</span>
                  <span className="text-[11px] text-slate-500">
                    Jika tidak dicentang, faktur bersifat opsional / anjuran bagi toko baru.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.halaman7.requireInvoiceProof}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      halaman7: { ...prev.halaman7, requireInvoiceProof: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Maksimal Ukuran File Unggahan (MB)
                </label>
                <input
                  type="number"
                  min={2}
                  max={25}
                  value={settings.halaman7.maxUploadSizeMb}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      halaman7: { ...prev.halaman7, maxUploadSizeMb: parseInt(e.target.value) || 10 },
                    }))
                  }
                  className="w-32 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
                <span className="text-[11px] text-slate-500 ml-2">(Default: 10 MB per file)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: HALAMAN 8 & 9 */}
        {activeTab === 'hal8' && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Konfigurasi Halaman 8 & 9: Standar SOP, Batas Usia & Pakta Integritas
              </h3>
              <p className="text-xs text-slate-500">
                Klausul hukum dan perlindungan data pribadi.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Batas Usia Minimal Pembeli Resmi (Tahun)
              </label>
              <input
                type="number"
                min={18}
                max={25}
                value={settings.halaman8.minimumAgeLimit}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    halaman8: { ...prev.halaman8, minimumAgeLimit: parseInt(e.target.value) || 21 },
                  }))
                }
                className="w-32 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <span className="text-[11px] text-slate-500 ml-2">(Regulasi rokok elektronik: 21 Tahun)</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Kepatuhan Ketat HET / MSRP Harga Jual</span>
                <span className="text-[11px] text-slate-500">
                  Reseller wajib mematuhi ketentuan batasan harga eceran resmi PT. PODA E-LIQUID COMPANY.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.halaman8.strictPriceCompliance}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    halaman8: { ...prev.halaman8, strictPriceCompliance: e.target.checked },
                  }))
                }
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Wajibkan Persetujuan Verifikasi Faktual Lapangan</span>
                <span className="text-[11px] text-slate-500">
                  Klausul hak audit dan kunjungan fisik oleh tim legal PT. PODA E-LIQUID COMPANY.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.halaman9.requireAuditAgreement}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    halaman9: { ...prev.halaman9, requireAuditAgreement: e.target.checked },
                  }))
                }
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Terakhir diubah: {new Date(settings.lastUpdated).toLocaleString('id-ID')}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan Pengaturan...' : 'Simpan Semua Pengaturan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
