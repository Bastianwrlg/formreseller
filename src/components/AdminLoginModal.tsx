import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // Validate credentials requested by user: admin / podaliquid123
      if (username.trim() === 'admin' && password === 'podaliquid123') {
        sessionStorage.setItem('poda_admin_authenticated', 'true');
        setLoading(false);
        onSuccess();
      } else {
        setLoading(false);
        setError('Kredensial tidak valid. Username atau password salah.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-blue-300" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Otorisasi Akses Internal</h2>
          <p className="text-xs text-blue-200/80 mt-1">
            PT. PODA E-LIQUID COMPANY
          </p>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username Admin
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Help Pill */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Kredensial Akses Admin:</span>
            </div>
            <div className="font-mono text-[11px] text-slate-700 bg-white p-1.5 rounded border border-slate-200 flex justify-between">
              <span>user: <strong className="text-blue-700">admin</strong></span>
              <span>password: <strong className="text-blue-700">podaliquid123</strong></span>
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-70"
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Masuk ke Portal Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
