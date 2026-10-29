import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  Eye,
  RefreshCw,
  Download,
  Building,
  Store,
  Globe,
  Award,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  FileSpreadsheet,
  LogOut,
  SlidersHorizontal,
  Bell,
} from 'lucide-react';
import { FormData, ApplicationStatus } from '../types/form';
import { ADMIN_DECISION_RULES } from '../data/indonesia';
import {
  apiGetApplications,
  apiUpdateDecision,
  subscribeToFirestoreApplications,
} from '../services/api';
import { SuratPenunjukanModal } from './SuratPenunjukanModal';
import { exportApplicationsToExcel } from '../utils/excelExport';
import { subscribeToSync } from '../services/syncService';
import { AdminFormSettings } from './AdminFormSettings';

interface AdminPortalProps {
  onBackToForm: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToForm }) => {
  const [applications, setApplications] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<FormData | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewerName, setReviewerName] = useState('Divisi Kemitraan PT. PODA E-LIQUID COMPANY');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [previewDocumentUrl, setPreviewDocumentUrl] = useState<string | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [adminTab, setAdminTab] = useState<'evaluations' | 'settings'>('evaluations');
  const [liveAlert, setLiveAlert] = useState<string | null>(null);

  const fetchApps = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    const data = await apiGetApplications({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery || undefined,
    });
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps(true);

    // 1. Subscribe to Cloud Firestore real-time snapshot (Multi-Device & Cross-User)
    const unsubscribeFirestore = subscribeToFirestoreApplications((freshList) => {
      let filtered = freshList;
      if (statusFilter !== 'all') {
        filtered = filtered.filter((a) => a.status === statusFilter);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            (a.registrationNumber && a.registrationNumber.toLowerCase().includes(q)) ||
            (a.businessTradeName && a.businessTradeName.toLowerCase().includes(q)) ||
            (a.applicantName && a.applicantName.toLowerCase().includes(q)) ||
            (a.nibNumber && a.nibNumber.toLowerCase().includes(q))
        );
      }
      setApplications(filtered);
      setLoading(false);
    });

    // 2. Subscribe to instant real-time events across tabs & windows
    const unsubscribeSync = subscribeToSync((event) => {
      if (event.type === 'NEW_APPLICATION') {
        const regNum = event.payload?.application?.registrationNumber || 'Baru';
        const storeName = event.payload?.application?.businessTradeName || 'Toko Reseller';
        setLiveAlert(`Permohonan baru masuk: ${regNum} (${storeName})`);
        fetchApps(false);
        setTimeout(() => setLiveAlert(null), 6000);
      } else if (event.type === 'APPLICATION_UPDATED' || event.type === 'FORCE_REFRESH') {
        fetchApps(false);
      }
    });

    // 3. Heartbeat polling every 10 seconds for multi-device sync redundancy
    const intervalId = setInterval(() => {
      fetchApps(false);
    }, 10000);

    return () => {
      unsubscribeFirestore();
      unsubscribeSync();
      clearInterval(intervalId);
    };
  }, [statusFilter, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApps();
  };

  const openAppDetail = (app: FormData) => {
    setSelectedApp(app);
    setAdminNotes(app.adminNotes || '');
  };

  const handleApplyDecision = async (rule: (typeof ADMIN_DECISION_RULES)[0]) => {
    if (!selectedApp) return;
    setIsUpdating(true);
    try {
      const res = await apiUpdateDecision(selectedApp.id, {
        decision: rule.decision,
        status: rule.status,
        adminNotes: adminNotes || rule.condition,
        reviewerName,
      });
      if (res.success && res.application) {
        setSelectedApp(res.application);
        setApplications((prev) =>
          prev.map((a) => (a.id === res.application!.id ? res.application! : a))
        );
      }
    } catch (e) {
      alert('Gagal memperbarui status permohonan.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus, decision?: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span className="truncate">Disetujui ({decision || 'Dapat Disetujui'})</span>
          </span>
        );
      case 'continued':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>Dapat Dilanjutkan</span>
          </span>
        );
      case 'on_hold':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>Tahan Permohonan</span>
          </span>
        );
      case 'channel_rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <XCircle className="w-3 h-3 shrink-0" />
            <span>Tolak Otorisasi</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 shrink-0" />
            <span>Ditolak</span>
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Clock className="w-3 h-3 shrink-0" />
            <span>Menunggu Evaluasi</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            <Clock className="w-3 h-3 shrink-0" />
            <span>Draf</span>
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    if (applications.length === 0) return;
    const headers = [
      'ID Registrasi',
      'Tanggal Pengajuan',
      'Nama Toko',
      'Nama Badan Usaha',
      'Bentuk Usaha',
      'NIB',
      'Provinsi',
      'Kota',
      'Saluran Penjualan',
      'Pemohon',
      'WhatsApp Pemohon',
      'Email Pemohon',
      'Merek',
      'Status',
      'Keputusan Admin',
    ];
    const rows = applications.map((a) => [
      a.registrationNumber || a.id,
      new Date(a.createdAt).toLocaleDateString('id-ID'),
      `"${a.businessTradeName || ''}"`,
      `"${a.businessLegalName || ''}"`,
      `"${a.businessType || ''}"`,
      `'${a.nibNumber || ''}`,
      `"${a.province || ''}"`,
      `"${a.city || ''}"`,
      `"${a.salesChannel || ''}"`,
      `"${a.applicantName || ''}"`,
      `'${a.applicantWhatsapp || ''}`,
      `"${a.applicantEmail || ''}"`,
      `"${a.targetBrands?.join('; ') || ''}"`,
      a.status,
      `"${a.adminDecision || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_pendaftaran_reseller_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === 'submitted').length;
  const approvedCount = applications.filter((a) => a.status === 'approved' || a.status === 'continued').length;
  const onHoldCount = applications.filter((a) => a.status === 'on_hold').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Live sync alert notification */}
      {liveAlert && (
        <div className="p-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-semibold animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 animate-bounce text-amber-300" />
            <span>{liveAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setLiveAlert(null)}
            className="text-blue-100 hover:text-white px-2 py-0.5 rounded text-xs"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 bg-blue-100 text-blue-800 rounded-xl shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-bold text-slate-900">
                  Portal Internal Verifikasi Reseller
                </h1>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Cloud Sync Aktif (Real-Time)</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Divisi Kemitraan PT. PODA E-LIQUID COMPANY • Standar Evaluasi SOP Halaman 20 & 21
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Ekspor Excel XLS / XLSX Dropdown */}
          <div className="relative">
            <div className="inline-flex rounded-xl shadow-xs border border-emerald-600">
              <button
                type="button"
                onClick={() => exportApplicationsToExcel(applications, 'xlsx', statusFilter)}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-l-xl transition-colors"
                title="Unduh data dalam format Excel rapi (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Ekspor Excel (.XLS)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="px-2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-r-xl transition-colors border-l border-emerald-500"
                title="Pilihan format ekspor"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {showExportDropdown && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowExportDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Format Lembar Kerja Excel
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      exportApplicationsToExcel(applications, 'xlsx', statusFilter);
                      setShowExportDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-emerald-50 flex items-start space-x-2.5 text-slate-800 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-950 block">Excel Modern (.XLSX)</span>
                      <span className="text-[10px] text-slate-500 leading-tight block">
                        Tabel rapi, teks tidak terpotong & kompatibel semua versi
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportApplicationsToExcel(applications, 'xls', statusFilter);
                      setShowExportDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-teal-50 flex items-start space-x-2.5 text-slate-800 transition-colors border-t border-slate-100"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-teal-950 block">Excel Klasik (.XLS)</span>
                      <span className="text-[10px] text-slate-500 leading-tight block">
                        Format standar Excel 97-2003
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleExportCSV();
                      setShowExportDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 flex items-center space-x-2 text-slate-600 border-t border-slate-100 transition-colors"
                  >
                    <Download className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-semibold block text-slate-700">Format CSV (.CSV)</span>
                      <span className="text-[10px] text-slate-400 block">Teks koma sederhana</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => fetchApps(true)}
            className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-xl transition-colors border border-blue-200"
            title="Muat data terbaru secara manual"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Muat Data</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Keluar dari sesi Portal Admin?')) {
                sessionStorage.removeItem('poda_admin_authenticated');
                onBackToForm();
              }
            }}
            className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl transition-colors border border-rose-200"
            title="Keluar dari sesi admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setAdminTab('evaluations')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
            adminTab === 'evaluations'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Evaluasi Permohonan Reseller</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            adminTab === 'evaluations' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
            adminTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Pengaturan Formulir Per Halaman</span>
        </button>
      </div>

      {/* Conditionally Render Settings or Evaluations */}
      {adminTab === 'settings' ? (
        <AdminFormSettings />
      ) : (
        <>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] sm:text-xs font-medium text-slate-500">Total Permohonan</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{totalCount}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] sm:text-xs font-medium text-indigo-600">Menunggu Evaluasi</span>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-700 mt-0.5">{pendingCount}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] sm:text-xs font-medium text-emerald-600">Disetujui / Lanjut</span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-0.5">{approvedCount}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] sm:text-xs font-medium text-amber-600">Ditahan (Butuh Bukti)</span>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-0.5">{onHoldCount}</p>
        </div>
      </div>

      {/* SOP Guidelines Accordion */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 sm:p-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
          <Award className="w-4 h-4 text-blue-700 shrink-0" />
          <span>Panduan 5 Keputusan Internal Admin (Halaman 20)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-blue-950">
          <div className="p-2 bg-white/85 rounded-lg border border-blue-100">
            <span className="font-bold text-emerald-800">1. Disetujui:</span> Identitas sesuai, dokumen lengkap, kanal memenuhi aturan.
          </div>
          <div className="p-2 bg-white/85 rounded-lg border border-blue-100">
            <span className="font-bold text-amber-800">2. Ditahan:</span> Pengisi tanpa bukti kuasa, atau asal barang belum jelas.
          </div>
          <div className="p-2 bg-white/85 rounded-lg border border-blue-100">
            <span className="font-bold text-rose-800">3. Tolak Kanal:</span> Lokasi fisik dekat sekolah / platform e-commerce melanggar.
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-72 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari toko, pemohon, NIB..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs scrollbar-none">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'submitted', label: 'Menunggu' },
            { key: 'approved', label: 'Disetujui' },
            { key: 'on_hold', label: 'Ditahan' },
            { key: 'channel_rejected', label: 'Tolak Kanal' },
            { key: 'draft', label: 'Draf' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE CARD VIEW (Optimized for Smartphone Screens < 768px) */}
      <div className="block md:hidden space-y-3">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
            {loading ? 'Memuat data permohonan...' : 'Tidak ada permohonan pendaftaran ditemukan.'}
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              onClick={() => openAppDetail(app)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-400 transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-700 block">
                    {app.registrationNumber || `Draf (${app.id.slice(0, 8)})`}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                    {app.businessTradeName || 'Nama Toko Belum Diisi'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {app.businessLegalName} • {app.city || 'Kota Belum Diisi'}
                  </p>
                </div>
                <div className="shrink-0">
                  {getStatusBadge(app.status, app.adminDecision)}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="inline-flex items-center space-x-1 text-slate-500">
                  <Store className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{app.salesChannel || '-'}</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  {new Date(app.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAppDetail(app);
                  }}
                  className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat & Evaluasi Keputusan</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Screens >= 768px) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">No. Registrasi</th>
                <th className="py-3 px-4">Toko & Badan Usaha</th>
                <th className="py-3 px-4">Saluran</th>
                <th className="py-3 px-4">Pemohon & Kontak</th>
                <th className="py-3 px-4">Status & Keputusan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    {loading ? 'Memuat data permohonan...' : 'Tidak ada permohonan pendaftaran yang cocok.'}
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => openAppDetail(app)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {app.registrationNumber || <span className="text-slate-400 italic">Draf ({app.id.slice(0, 8)})</span>}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">
                        {new Date(app.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{app.businessTradeName || '-'}</div>
                      <div className="text-xs text-slate-500">
                        {app.businessLegalName} ({app.city}, {app.province})
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">NIB: {app.nibNumber || '-'}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {app.salesChannel === 'Toko Fisik Saja' && <Store className="w-3.5 h-3.5 text-blue-600" />}
                        {app.salesChannel === 'Toko Online Saja' && <Globe className="w-3.5 h-3.5 text-indigo-600" />}
                        {app.salesChannel === 'Toko Fisik dan Toko Online' && <Building className="w-3.5 h-3.5 text-teal-600" />}
                        <span>{app.salesChannel || '-'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{app.applicantName || '-'}</div>
                      <div className="text-xs text-slate-500 font-mono">{app.applicantWhatsapp}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{app.applicantEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(app.status, app.adminDecision)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openAppDetail(app);
                        }}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Evaluasi</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Decision Evaluation Modal (Fully Responsive on Mobile) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] sm:text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 shrink-0">
                    {selectedApp.registrationNumber || 'DRAF'}
                  </span>
                  <h2 className="text-sm sm:text-lg font-bold text-slate-900 truncate">
                    {selectedApp.businessTradeName || 'Tanpa Nama'}
                  </h2>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                  Diajukan: {new Date(selectedApp.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                {selectedApp.status === 'approved' && (
                  <button
                    type="button"
                    onClick={() => setShowLetterModal(true)}
                    className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Surat Penunjukan</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
                >
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {/* Section 1: Ringkasan Pemohon & Badan Usaha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <h3 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs uppercase tracking-wider text-slate-500">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Identitas Pemohon & Pengurus</span>
                  </h3>
                  <p><span className="text-slate-500">Nama Pemohon:</span> <strong>{selectedApp.applicantName}</strong></p>
                  <p><span className="text-slate-500">Hubungan:</span> {selectedApp.applicantRelation}</p>
                  <p><span className="text-slate-500">WhatsApp:</span> <span className="font-mono">{selectedApp.applicantWhatsapp}</span></p>
                  <p className="truncate"><span className="text-slate-500">Email:</span> {selectedApp.applicantEmail}</p>
                  <p><span className="text-slate-500">Pemilik Sah:</span> {selectedApp.ownerName} ({selectedApp.ownerWhatsapp})</p>
                </div>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <h3 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs uppercase tracking-wider text-slate-500">
                    <Building className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Identitas Badan Usaha</span>
                  </h3>
                  <p><span className="text-slate-500">Nama Toko:</span> <strong>{selectedApp.businessTradeName}</strong></p>
                  <p><span className="text-slate-500">Badan Usaha:</span> {selectedApp.businessLegalName} ({selectedApp.businessType})</p>
                  <p><span className="text-slate-500">NIB OSS:</span> <span className="font-mono font-bold text-blue-700">{selectedApp.nibNumber}</span></p>
                  <p><span className="text-slate-500">Alamat:</span> {selectedApp.registeredAddress}</p>
                  <p><span className="text-slate-500">Wilayah:</span> {selectedApp.city}, {selectedApp.province}</p>
                </div>
              </div>

              {/* Section 2: Saluran Penjualan */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs uppercase tracking-wider text-slate-500">
                  <Store className="w-3.5 h-3.5 text-teal-600" />
                  <span>Kanal Penjualan ({selectedApp.salesChannel})</span>
                </h3>

                {selectedApp.physicalStoreAddress && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                    <p className="font-bold text-slate-900">Gerai: {selectedApp.physicalStoreName}</p>
                    <p><span className="text-slate-500">Alamat:</span> {selectedApp.physicalStoreAddress}</p>
                    {selectedApp.physicalStoreMapsUrl && (
                      <a href={selectedApp.physicalStoreMapsUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>Buka Google Maps</span>
                      </a>
                    )}
                    <p>Zonasi Sekolah: <strong className="text-emerald-700">{selectedApp.physicalStoreCompliance}</strong></p>
                  </div>
                )}

                {selectedApp.onlineStoreUrl && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                    <p className="font-bold text-slate-900">Toko Online: {selectedApp.onlineStoreName} ({selectedApp.onlineStorePlatform})</p>
                    <a href={selectedApp.onlineStoreUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-1 truncate">
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{selectedApp.onlineStoreUrl}</span>
                    </a>
                    <p>Pemilik Akun: {selectedApp.onlineStoreAccountOwner}</p>
                  </div>
                )}
              </div>

              {/* Section 3: Dokumen Pendukung */}
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Dokumen Pendukung yang Diunggah
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'NIB', file: selectedApp.docNib },
                    { label: 'Foto Toko', file: selectedApp.docPhysicalStorePhoto },
                    { label: 'Screenshot Online', file: selectedApp.docOnlineStoreScreenshot },
                    { label: 'Invoice/Bukti Beli', file: selectedApp.docPurchaseProof },
                    { label: 'Surat Kuasa', file: selectedApp.docPowerOfAttorney },
                    { label: 'Dokumen Pengurus', file: selectedApp.docBoardAuthority },
                  ].map((doc) => (
                    <div key={doc.label} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <span className="text-[11px] text-slate-400 font-medium block truncate">{doc.label}</span>
                      {doc.file ? (
                        <div className="mt-1">
                          <p className="font-semibold text-slate-800 truncate text-[11px]">{doc.file.name}</p>
                          {doc.file.dataUrl && (
                            <button
                              type="button"
                              onClick={() => setPreviewDocumentUrl(doc.file!.dataUrl!)}
                              className="mt-1 w-full py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold"
                            >
                              Pratinjau
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic block mt-1">Tidak ada</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: 5 Standar Keputusan Admin */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-bold text-sm tracking-tight flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Eksekusi Keputusan Evaluasi (Panduan Halaman 20)</span>
                  </h3>
                  <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-cyan-200 self-start sm:self-auto">
                    {selectedApp.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {ADMIN_DECISION_RULES.map((rule) => (
                    <button
                      key={rule.decision}
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleApplyDecision(rule)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedApp.adminDecision === rule.decision
                          ? 'border-cyan-400 bg-white/20 ring-2 ring-cyan-400/50'
                          : 'border-white/15 bg-white/10 hover:bg-white/15'
                      }`}
                    >
                      <span className="font-bold text-xs block text-white">{rule.decision}</span>
                      <span className="text-[10px] text-slate-300 mt-0.5 block leading-tight">
                        {rule.condition}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Catatan Evaluator:
                  </label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Alasan keputusan atau kelengkapan..."
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Surat Penunjukan Modal */}
      {showLetterModal && selectedApp && (
        <SuratPenunjukanModal
          application={selectedApp}
          onClose={() => setShowLetterModal(false)}
        />
      )}
      </>
      )}

      {/* Document Quick Preview Modal */}
      {previewDocumentUrl && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] p-3 sm:p-4 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 mb-2">
              <span className="text-xs font-bold text-slate-800">Pratinjau Dokumen</span>
              <button
                type="button"
                onClick={() => setPreviewDocumentUrl(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-100 rounded-xl p-2">
              {previewDocumentUrl.startsWith('data:image') ? (
                <img src={previewDocumentUrl} alt="Preview" className="max-h-[60vh] object-contain rounded" />
              ) : (
                <div className="text-center p-4 bg-white rounded-xl shadow-xs">
                  <FileText className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-800">Dokumen PDF Terlampir</p>
                  <a
                    href={previewDocumentUrl}
                    download="dokumen_verifikasi.pdf"
                    className="mt-2 inline-block px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Unduh / Buka Dokumen
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
