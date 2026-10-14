import React from 'react';
import { ShieldCheck, Cloud, RefreshCw, FileText, LayoutDashboard, PlusCircle, Settings } from 'lucide-react';

interface NavbarProps {
  activeView: 'form' | 'admin' | 'settings';
  setActiveView: (view: 'form' | 'admin' | 'settings') => void;
  isSaving: boolean;
  lastSavedAt: string | null;
  onResetForm: () => void;
  submittedCount?: number;
  companyName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  isSaving,
  lastSavedAt,
  onResetForm,
  submittedCount = 0,
  companyName = 'PT. PODA E-LIQUID COMPANY',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => setActiveView('form')}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-xs sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                  PORTAL RESELLER
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                  {companyName.includes('PODA') ? 'PT. PODA' : 'OFFICIAL'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block truncate">
                {companyName} • Otorisasi Reseller Resmi
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {/* Auto-save status indicator (Visible on mobile too!) */}
            {activeView === 'form' && (
              <div
                title={lastSavedAt ? `Tersimpan di DB: ${lastSavedAt}` : 'Menyimpan...'}
                className="hidden xs:flex items-center space-x-1 text-[11px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3 h-3 text-blue-600 animate-spin shrink-0" />
                    <span className="text-blue-700 font-medium hidden sm:inline">Menyimpan draf...</span>
                    <span className="text-blue-700 font-medium sm:hidden text-[10px]">Menyimpan</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="text-slate-600 hidden md:inline">
                      DB: {lastSavedAt ? lastSavedAt : 'Tersimpan'}
                    </span>
                    <span className="text-emerald-700 font-medium md:hidden text-[10px]">Tersimpan</span>
                  </>
                )}
              </div>
            )}

            {/* View Switcher: Form vs Admin Data vs Setting Form */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200">
              {/* Menu 1: Formulir */}
              <button
                type="button"
                onClick={() => setActiveView('form')}
                title="Buka Formulir Pendaftaran Reseller"
                className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'form'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Formulir</span>
              </button>

              {/* Menu 2: Admin Data Permohonan */}
              <button
                type="button"
                onClick={() => setActiveView('admin')}
                title="Portal Evaluasi & Verifikasi Reseller"
                className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Data Reseller</span>
                <span className="sm:hidden">Data</span>
                {submittedCount > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      activeView === 'admin' ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {submittedCount}
                  </span>
                )}
              </button>

              {/* Menu 3: Setting Form (Admin) */}
              <button
                type="button"
                onClick={() => setActiveView('settings')}
                title="Pengaturan Formulir Pendaftaran"
                className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'settings'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Setting Form</span>
                <span className="sm:hidden">Setting</span>
              </button>
            </div>

            {/* Reset / New Form Button */}
            {activeView === 'form' && (
              <button
                type="button"
                onClick={onResetForm}
                title="Mulai formulir baru"
                className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Form Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
