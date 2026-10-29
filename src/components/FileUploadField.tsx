import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Eye, Sparkles, FolderOpen } from 'lucide-react';
import { UploadedFile } from '../types/form';
import { compressImage } from '../utils/imageCompressor';
import { createStandardPdfDataUrl } from '../utils/pdfGenerator';

interface FileUploadFieldProps {
  label: string;
  fieldNumber: string;
  required?: boolean;
  statusBadge?: 'Wajib' | 'Kondisional' | 'Opsional';
  hint?: string;
  acceptedFormats?: string;
  maxSizeMb?: number;
  file?: UploadedFile;
  error?: string;
  onFileSelect: (file: UploadedFile | undefined) => void;
  allowSample?: boolean;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  fieldNumber,
  statusBadge = 'Wajib',
  hint,
  maxSizeMb = 10,
  acceptedFormats,
  file,
  error,
  onFileSelect,
  allowSample = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const displayFormats = acceptedFormats || `PDF, JPG, PNG (Maks ${maxSizeMb}MB)`;

  const handleUseSampleFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isDocPdf = fieldNumber === '36' || fieldNumber === '39' || fieldNumber === '40' || fieldNumber === '41';
    const sampleName = isDocPdf
      ? `Dokumen_Resmi_OSS_${fieldNumber}_PODA.pdf`
      : `Foto_Verifikasi_Toko_${fieldNumber}_PODA.jpg`;

    let dataUrl = '';
    let fileType = '';
    let fileSize = 145000;

    if (isDocPdf) {
      dataUrl = createStandardPdfDataUrl(sampleName, label, {
        regNumber: `REG-PODA-${fieldNumber}-${Date.now().toString().slice(-4)}`,
        storeName: 'PODA Store Mitra Resmi',
        applicant: 'Pendaftar Kemitraan',
      });
      fileType = 'application/pdf';
      fileSize = Math.round(dataUrl.length * 0.75);
    } else {
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#f8fafc" stroke="#94a3b8" stroke-width="4"/>
      <rect x="30" y="30" width="540" height="70" rx="8" fill="#1e3a8a"/>
      <text x="300" y="75" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">PT. PODA E-LIQUID COMPANY</text>
      <text x="300" y="160" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">${label.toUpperCase()}</text>
      <text x="300" y="195" font-family="sans-serif" font-size="14" fill="#475569" text-anchor="middle">Nomor Berkas: BERKAS-${fieldNumber}-${Date.now().toString().slice(-6)}</text>
      <text x="300" y="240" font-family="sans-serif" font-size="14" font-weight="bold" fill="#16a34a" text-anchor="middle">✓ FOTO VERIFIKASI RESMI TERVERIFIKASI</text>
      <line x1="60" y1="280" x2="540" y2="280" stroke="#cbd5e1" stroke-width="2"/>
      <text x="300" y="320" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Diunggah untuk Otorisasi Pendaftaran Reseller Resmi PT. PODA E-LIQUID COMPANY</text>
    </svg>`;
      dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
      fileType = 'image/svg+xml';
    }

    const uploaded: UploadedFile = {
      id: `file_sample_${Date.now()}_${fieldNumber}`,
      name: sampleName,
      size: fileSize,
      type: fileType,
      dataUrl: dataUrl,
      uploadedAt: new Date().toISOString(),
    };
    onFileSelect(uploaded);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    processFile(selected);
  };

  const processFile = async (selected: File) => {
    // Validate size (maxSizeMb)
    if (selected.size > maxSizeMb * 1024 * 1024) {
      alert(`Ukuran file melebihi batas ${maxSizeMb}MB.`);
      return;
    }

    try {
      const dataUrl = await compressImage(selected, 1000, 0.7);
      const uploaded: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: selected.name,
        size: selected.size,
        type: selected.type,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      };
      onFileSelect(uploaded);
    } catch (err) {
      console.warn('Compression fallback to normal reader:', err);
      const reader = new FileReader();
      reader.onload = () => {
        const uploaded: UploadedFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: selected.name,
          size: selected.size,
          type: selected.type,
          dataUrl: reader.result as string,
          uploadedAt: new Date().toISOString(),
        };
        onFileSelect(uploaded);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      processFile(dropped);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const isImage = file?.type.startsWith('image/');

  return (
    <div
      id={`field-upload-${fieldNumber}`}
      className={`bg-white p-5 rounded-2xl border transition-all ${
        error
          ? 'border-rose-400 bg-rose-50/20 shadow-xs ring-2 ring-rose-200'
          : 'border-slate-200 hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                error ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {fieldNumber}
            </span>
            <span className="text-sm font-semibold text-slate-900">{label}</span>
          </div>
          {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
        </div>

        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
            statusBadge === 'Wajib'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : statusBadge === 'Kondisional'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          [{statusBadge}]
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-3 border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
              : error
              ? 'border-rose-300 bg-rose-50/30'
              : 'border-slate-300 bg-slate-50/30 hover:border-blue-400 hover:bg-slate-50/60'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-800">
              Pilih dokumen dari perangkat Anda atau tarik file ke sini
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 mb-3.5">
              Format: {displayFormats}
            </p>

            {/* Action buttons: Pick File & Quick Sample */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Pilih Berkas / Foto</span>
              </button>

              {allowSample && (
                <button
                  type="button"
                  onClick={handleUseSampleFile}
                  title="Gunakan contoh dokumen simulasi untuk kemudahan pengisian cepat"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Contoh Otomatis (1-Klik)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center space-x-3 overflow-hidden">
            {isImage && file.dataUrl ? (
              <img
                src={file.dataUrl}
                alt={file.name}
                className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">{file.name}</p>
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <span>{formatSize(file.size)}</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Berhasil Diunggah
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0 ml-2">
            {file.dataUrl && (
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                title="Lihat Pratinjau Dokumen"
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onFileSelect(undefined)}
              title="Hapus File"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-1.5 mt-2 text-rose-600 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && file?.dataUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-slate-800 truncate">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 flex items-center justify-center bg-slate-900/5">
              {isImage ? (
                <img src={file.dataUrl} alt={file.name} className="max-h-[60vh] object-contain rounded-lg shadow-xs" />
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-xs border border-slate-200 max-w-md">
                  <FileText className="w-16 h-16 text-rose-500 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Dokumen format PDF ({formatSize(file.size)})</p>
                  <a
                    href={file.dataUrl}
                    download={file.name}
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                  >
                    Unduh / Buka Dokumen
                  </a>
                </div>
              )}
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
