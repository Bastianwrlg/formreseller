/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { StepProgressBar } from './components/StepProgressBar';
import { Step1Info } from './components/steps/Step1Info';
import { Step2Applicant } from './components/steps/Step2Applicant';
import { Step3Business } from './components/steps/Step3Business';
import { Step4Channel } from './components/steps/Step4Channel';
import { Step5APhysicalStore } from './components/steps/Step5APhysicalStore';
import { Step5BOnlineStore } from './components/steps/Step5BOnlineStore';
import { Step5CBothStores } from './components/steps/Step5CBothStores';
import { Step6Products } from './components/steps/Step6Products';
import { Step7Documents } from './components/steps/Step7Documents';
import { Step8Terms } from './components/steps/Step8Terms';
import { Step9Confirmation } from './components/steps/Step9Confirmation';
import { StepSuccess } from './components/steps/StepSuccess';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FormData, FormErrors } from './types/form';
import { FormPageSettings, DEFAULT_FORM_SETTINGS } from './types/formSettings';
import { validateStep } from './utils/validation';
import {
  initialFormData,
  getLocalDraft,
  saveLocalDraft,
  clearLocalDraft,
  apiSaveDraft,
  apiSubmitApplication,
  apiGetStats,
  apiGetFormSettings,
  subscribeToFirestoreSettings,
} from './services/api';
import { subscribeToSync } from './services/syncService';

export default function App() {
  const [activeView, setActiveView] = useState<'form' | 'admin'>('form');
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = getLocalDraft();
    if (saved && saved.status === 'draft') {
      return saved;
    }
    return {
      ...initialFormData,
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    const saved = getLocalDraft();
    return saved?.currentStep || 1;
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<{ total: number; submitted: number } | null>(null);
  const [validationToast, setValidationToast] = useState<string | null>(null);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [formSettings, setFormSettings] = useState<FormPageSettings>(DEFAULT_FORM_SETTINGS);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load dynamic form page settings and listen to live updates
  useEffect(() => {
    apiGetFormSettings().then((s) => {
      if (s) setFormSettings(s);
    });

    // 1. Live settings from Cloud Firestore across all devices
    const unsubscribeFirestore = subscribeToFirestoreSettings((s) => {
      setFormSettings(s);
    });

    // 2. Cross-tab sync
    const unsubscribeSync = subscribeToSync((event) => {
      if (event.type === 'SETTINGS_UPDATED' && event.payload?.settings) {
        setFormSettings(event.payload.settings);
      }
    });

    return () => {
      unsubscribeFirestore();
      unsubscribeSync();
    };
  }, []);

  const handleSetActiveView = (view: 'form' | 'admin' | 'settings') => {
    if (view === 'admin' || view === 'settings') {
      const isAuth = sessionStorage.getItem('poda_admin_authenticated') === 'true';
      if (isAuth) {
        setActiveView('admin');
      } else {
        setShowAdminLoginModal(true);
      }
    } else {
      setActiveView('form');
    }
  };

  // Fetch initial stats
  useEffect(() => {
    apiGetStats().then((data) => {
      if (data) setStats(data);
    });
  }, [activeView]);

  // Automatic auto-save to Database whenever formData changes
  useEffect(() => {
    if (formData.status !== 'draft') return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsSaving(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const payload = {
          ...formData,
          currentStep,
          updatedAt: new Date().toISOString(),
        };
        saveLocalDraft(payload);
        await apiSaveDraft(payload);
        const timeStr = new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setLastSavedAt(timeStr);
      } catch (err) {
        console.warn('Auto-save error', err);
      } finally {
        setIsSaving(false);
      }
    }, 700);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [formData, currentStep]);

  // Navigate to Next step with strict validation
  const handleNextStep = () => {
    const stepErrors = validateStep(currentStep, formData, formSettings);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);

      // Provide the exact descriptive error message so applicant knows exactly what is missing
      const firstErrorMsg =
        Object.values(stepErrors)[0] ||
        'Harap periksa dan lengkapi data bertanda (*) sebelum melanjutkan.';
      setValidationToast(firstErrorMsg);
      setTimeout(() => setValidationToast(null), 5000);

      // Scroll to the first missing element or error section
      const firstErrorKey = Object.keys(stepErrors)[0];
      const targetElement = document.querySelector(
        `[name="${firstErrorKey}"], #field-upload-36, #field-upload-37, #field-upload-38, #field-upload-39, #field-upload-40, #field-upload-41`
      );
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
      return;
    }

    // Clear errors and mark current step as completed
    setErrors({});
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    const next = currentStep + 1;
    setCurrentStep(next);
    setFormData((prev) => ({ ...prev, currentStep: next }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Previous step
  const handlePrevStep = () => {
    setErrors({});
    const prev = Math.max(1, currentStep - 1);
    setCurrentStep(prev);
    setFormData((p) => ({ ...p, currentStep: prev }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump to specific step
  const handleStepClick = (step: number) => {
    // If clicking backward, always allowed
    if (step < currentStep) {
      setErrors({});
      setCurrentStep(step);
      setFormData((p) => ({ ...p, currentStep: step }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If clicking forward, validate current step first
    const stepErrors = validateStep(currentStep, formData, formSettings);
    if (Object.keys(stepErrors).length === 0) {
      setErrors({});
      setCurrentStep(step);
      setFormData((p) => ({ ...p, currentStep: step }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrors(stepErrors);
      const firstMsg = Object.values(stepErrors)[0];
      if (firstMsg) {
        setValidationToast(firstMsg);
        setTimeout(() => setValidationToast(null), 4000);
      }
    }
  };

  // Submit Final Application
  const handleSubmit = async () => {
    const stepErrors = validateStep(9, formData, formSettings);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setValidationToast(Object.values(stepErrors)[0] || null);
      setTimeout(() => setValidationToast(null), 4000);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiSubmitApplication(formData);
      if (res.success && res.application) {
        setFormData(res.application);
        setCurrentStep(10); // Success step
        setCompletedSteps([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        // Update stats
        apiGetStats().then((data) => {
          if (data) setStats(data);
        });
      } else {
        alert(res.message || 'Gagal mengirim formulir.');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan saat menyimpan formulir ke database: ' + err.message);
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset / New Form
  const handleResetForm = () => {
    if (
      window.confirm(
        'Apakah Anda ingin memulai pengisian formulir baru? Data yang belum dikirim akan direset.'
      )
    ) {
      clearLocalDraft();
      const freshData: FormData = {
        ...initialFormData,
        id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      };
      setFormData(freshData);
      setCurrentStep(1);
      setCompletedSteps([]);
      setErrors({});
      setLastSavedAt(null);
    }
  };

  // Render dynamic Step 5 based on salesChannel selection
  const renderStep5 = () => {
    if (formData.salesChannel === 'Toko Fisik Saja') {
      return (
        <Step5APhysicalStore
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      );
    }

    if (formData.salesChannel === 'Toko Online Saja') {
      return (
        <Step5BOnlineStore
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      );
    }

    // Default to 5C (Toko Fisik dan Toko Online)
    return (
      <Step5CBothStores
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onNext={handleNextStep}
        onPrev={handlePrevStep}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={handleSetActiveView}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        onResetForm={handleResetForm}
        submittedCount={stats?.total || 0}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'admin' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminPortal onBackToForm={() => setActiveView('form')} />
          </div>
        ) : (
          <div>
            {/* Step Progress Bar (hidden on success) */}
            {currentStep <= 9 && (
              <StepProgressBar
                currentStep={currentStep}
                salesChannel={formData.salesChannel}
                onStepClick={handleStepClick}
                completedSteps={completedSteps}
              />
            )}

            {/* Step Form Body */}
            <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
              {currentStep === 1 && (
                <Step1Info
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  onNext={handleNextStep}
                  settings={formSettings}
                />
              )}

              {currentStep === 2 && (
                <Step2Applicant
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  settings={formSettings}
                />
              )}

              {currentStep === 3 && (
                <Step3Business
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  settings={formSettings}
                />
              )}

              {currentStep === 4 && (
                <Step4Channel
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  settings={formSettings}
                />
              )}

              {currentStep === 5 && renderStep5()}

              {currentStep === 6 && (
                <Step6Products
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  settings={formSettings}
                />
              )}

              {currentStep === 7 && (
                <Step7Documents
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  settings={formSettings}
                />
              )}

              {currentStep === 8 && (
                <Step8Terms
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  settings={formSettings}
                />
              )}

              {currentStep === 9 && (
                <Step9Confirmation
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  onSubmit={handleSubmit}
                  onPrev={handlePrevStep}
                  isSubmitting={isSubmitting}
                  settings={formSettings}
                />
              )}

              {currentStep === 10 && (
                <StepSuccess
                  formData={formData}
                  onNewRegistration={handleResetForm}
                  onOpenAdmin={() => handleSetActiveView('admin')}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Admin Login Modal (Guard) */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onSuccess={() => {
          setShowAdminLoginModal(false);
          setActiveView('admin');
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-slate-700">© 2026 PT. PODA E-LIQUID COMPANY. Seluruh Hak Dilindungi.</p>
          <div className="flex items-center space-x-3 text-slate-500">
            <span>Sistem Verifikasi & Otorisasi Kemitraan</span>
            <span>•</span>
            <span>Portal Resmi Reseller</span>
          </div>
        </div>
      </footer>

      {/* Validation Toast Notification */}
      {validationToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-rose-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 text-xs sm:text-sm font-medium border border-rose-700/50 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping shrink-0" />
          <span>{validationToast}</span>
        </div>
      )}
    </div>
  );
}
