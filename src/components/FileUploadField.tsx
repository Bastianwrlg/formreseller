import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Eye } from 'lucide-react';
import { UploadedFile } from '../types/form';

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
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const displayFormats = acceptedFormats || `PDF, JPG, PNG (Maks ${maxSizeMb}MB)`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    processFile(selected);
  };

  const processFile = (selected: File) => {
    // Validate size (maxSizeMb)
    if (selected.size > maxSizeMb * 1024 * 1024) {
      alert(`Ukuran file melebihi batas ${maxSizeMb}MB.`);
      return;
    }

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
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs transition-all hover:border-slate-300">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
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
          onClick={() => inputRef.current?.click()}
          className={`mt-3 border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
              : error
              ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            Klik untuk memilih file atau seret & lepas file ke sini
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Format yang diterima: {displayFormats}</p>
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
