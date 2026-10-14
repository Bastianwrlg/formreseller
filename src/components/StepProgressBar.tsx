import React, { useState } from 'react';
import {
  FileText,
  UserCheck,
  Building2,
  Share2,
  Store,
  PackageCheck,
  UploadCloud,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SalesChannel } from '../types/form';

interface StepProgressBarProps {
  currentStep: number;
  salesChannel: SalesChannel | '';
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  salesChannel,
  onStepClick,
  completedSteps,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine dynamic label for Step 5
  let step5Label = 'Info Toko';
  let step5Sub = 'Hal 5';
  if (salesChannel === 'Toko Fisik Saja') {
    step5Label = 'Toko Fisik';
    step5Sub = 'Hal 5A';
  } else if (salesChannel === 'Toko Online Saja') {
    step5Label = 'Toko Online';
    step5Sub = 'Hal 5B';
  } else if (salesChannel === 'Toko Fisik dan Toko Online') {
    step5Label = 'Fisik & Online';
    step5Sub = 'Hal 5C';
  }

  const steps = [
    { number: 1, label: 'Ketentuan Umum', sub: 'Hal 1', icon: FileText },
    { number: 2, label: 'Identitas Pemohon', sub: 'Hal 2', icon: UserCheck },
    { number: 3, label: 'Identitas Usaha', sub: 'Hal 3', icon: Building2 },
    { number: 4, label: 'Saluran Penjualan', sub: 'Hal 4', icon: Share2 },
    { number: 5, label: step5Label, sub: step5Sub, icon: Store },
    { number: 6, label: 'Produk & Pemasok', sub: 'Hal 6', icon: PackageCheck },
    { number: 7, label: 'Upload Dokumen', sub: 'Hal 7', icon: UploadCloud },
    { number: 8, label: 'Syarat & Privasi', sub: 'Hal 8', icon: ShieldAlert },
    { number: 9, label: 'Pernyataan Akhir', sub: 'Hal 9', icon: CheckCircle2 },
  ];

  const currentStepObj = steps.find((s) => s.number === currentStep) || steps[0];
  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / (steps.length - 1)) * 100));

  return (
    <div className="bg-white border-b border-slate-200 py-2.5 sm:py-3 px-3 sm:px-6 shadow-xs sticky top-14 sm:top-16 z-30">
      <div className="max-w-5xl mx-auto">
        {/* Top Summary Header */}
        <div className="flex items-center justify-between mb-2">
          {/* Mobile Step Badge & Accordion Toggle */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors md:cursor-default md:hover:bg-blue-50"
            >
              <span>Hal {currentStep <= 9 ? currentStep : 9}/9:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[150px] sm:max-w-none">
                {currentStepObj.label}
              </span>
              <span className="md:hidden">
                {mobileMenuOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                )}
              </span>
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-600 shrink-0">
            {progressPercent}% Selesai
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Mobile Dropdown Menu to jump across steps */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-2 gap-1.5 shadow-md animate-in fade-in duration-150">
            {steps.map((step) => {
              const isCurrent = step.number === currentStep;
              const isPassed = completedSteps.includes(step.number) || currentStep > step.number;
              const canClick = isPassed || step.number <= currentStep;
              const Icon = step.icon;

              return (
                <button
                  key={step.number}
                  type="button"
                  disabled={!canClick}
                  onClick={() => {
                    if (canClick) {
                      onStepClick(step.number);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`flex items-center space-x-2 p-2 rounded-xl text-left text-xs transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-bold'
                      : canClick
                      ? 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
                      : 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Desktop / Tablet Step Scroller */}
        <div className="hidden md:block overflow-x-auto scrollbar-none pt-1">
          <div className="flex items-center justify-between">
            {steps.map((step) => {
              const isCurrent = step.number === currentStep;
              const isPassed = completedSteps.includes(step.number) || currentStep > step.number;
              const canClick = isPassed || step.number <= currentStep;
              const Icon = step.icon;

              return (
                <button
                  key={step.number}
                  type="button"
                  disabled={!canClick}
                  onClick={() => canClick && onStepClick(step.number)}
                  className={`flex flex-col items-center group relative text-center px-1 transition-all ${
                    canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-medium mt-1 leading-tight line-clamp-1 ${
                      isCurrent
                        ? 'text-blue-700 font-bold'
                        : isPassed
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {step.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
