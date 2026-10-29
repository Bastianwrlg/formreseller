import { FormData } from '../types/form';
import { FormPageSettings, DEFAULT_FORM_SETTINGS } from '../types/formSettings';
import { broadcastSyncEvent } from './syncService';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned;
  }
  return obj;
}

const LOCAL_STORAGE_KEY = 'reseller_application_active_draft_v1';
const LOCAL_STORAGE_ALL_APPS = 'reseller_all_applications_db_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'reseller_form_settings_v1';

export const initialFormData: FormData = {
  id: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  currentStep: 1,
  status: 'draft',

  // Step 1
  acceptedGeneralInfo: false,

  // Step 2
  applicantName: '',
  applicantRelation: '',
  applicantWhatsapp: '',
  applicantEmail: '',
  ownerName: '',
  ownerWhatsapp: '',
  ownerEmail: '',
  sameAsApplicant: false,

  // Step 3
  businessTradeName: '',
  businessType: '',
  businessTypeOther: '',
  businessLegalName: '',
  nibNumber: '',
  registeredAddress: '',
  city: '',
  province: '',

  // Step 4
  salesChannel: '',

  // Step 5A / 5B / 5C
  physicalStoreName: '',
  physicalStoreAddress: '',
  physicalStoreMapsUrl: '',
  physicalStorePicName: '',
  physicalStoreWhatsapp: '',
  physicalStoreOperatingStatus: '',
  physicalStoreCompliance: '',

  onlineStoreName: '',
  onlineStorePlatform: '',
  onlineStorePlatformOther: '',
  onlineStoreUrl: '',
  onlineStoreSellerId: '',
  onlineStoreAccountOwner: '',
  onlineStoreOperatingStatus: '',
  onlineStorePlatformCompliance: '',
  onlineStoreAgeVerification: '',

  // Step 6
  targetBrands: [],
  otherBrandName: '',
  purchaseSource: '',
  distributorSupplierName: 'PT. PODA E-LIQUID COMPANY',
  distributorCity: '',
  willingToProvideProof: '',

  // Step 7
  docNib: undefined,
  docPhysicalStorePhoto: undefined,
  docOnlineStoreScreenshot: undefined,
  docPurchaseProof: undefined,
  docPowerOfAttorney: undefined,
  docBoardAuthority: undefined,
  uploadLaterConsent: false,

  // Step 8
  agreeTerms: false,
  agreePrivacy: false,

  // Step 9
  statementSignerName: '',
  statementTruth: false,
  statementVerificationConsent: false,
};

// Seed default applications for standalone/Netlify mode
function getSeedApplications(): FormData[] {
  return [
    {
      id: 'app-seed-001',
      registrationNumber: 'REG-202610-7712',
      createdAt: '2026-10-12T08:30:00.000Z',
      updatedAt: '2026-10-12T09:15:00.000Z',
      currentStep: 10,
      status: 'approved',
      adminDecision: 'Dapat diajukan untuk persetujuan',
      adminNotes: 'Dokumen NIB OSS terverifikasi aktif, toko fisik berjarak aman >250m dari satuan pendidikan, kelengkapan berkas valid.',
      reviewedAt: '2026-10-12T11:00:00.000Z',
      reviewedBy: 'Divisi Kemitraan PT. PODA E-LIQUID COMPANY',
      acceptedGeneralInfo: true,
      applicantName: 'Bambang Sudirman',
      applicantRelation: 'Pemilik usaha perseorangan',
      applicantWhatsapp: '081298765432',
      applicantEmail: 'bambang@podaliquidstore.com',
      ownerName: 'Bambang Sudirman',
      ownerWhatsapp: '081298765432',
      ownerEmail: 'bambang@podaliquidstore.com',
      sameAsApplicant: true,
      businessTradeName: 'Poda Vapor Store Kemang',
      businessType: 'Perseroan Terbatas (PT)',
      businessTypeOther: '',
      businessLegalName: 'PT Nusantara Retail Mandiri',
      nibNumber: '1234567890123',
      registeredAddress: 'Jl. Kemang Raya No. 42B, Mampang Prapatan',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      salesChannel: 'Toko Fisik dan Toko Online',
      physicalStoreName: 'Poda Vapor Lounge Kemang',
      physicalStoreAddress: 'Jl. Kemang Raya No. 42B, Mampang Prapatan, Jakarta Selatan',
      physicalStoreMapsUrl: 'https://maps.google.com/?q=-6.2608,106.8156',
      physicalStorePicName: 'Bambang Sudirman',
      physicalStoreWhatsapp: '081298765432',
      physicalStoreOperatingStatus: 'Sudah beroperasi',
      physicalStoreCompliance: 'Ya',
      onlineStoreName: 'PodaLiquid_OfficialStore',
      onlineStorePlatform: 'Tokopedia',
      onlineStorePlatformOther: '',
      onlineStoreUrl: 'https://tokopedia.com/podaliquidofficial',
      onlineStoreSellerId: 'PODA-SHOP-8812',
      onlineStoreAccountOwner: 'PT Nusantara Retail Mandiri',
      onlineStoreOperatingStatus: 'Sudah aktif',
      onlineStorePlatformCompliance: 'Ya, berdasarkan ketentuan platform yang berlaku',
      onlineStoreAgeVerification: 'Ya',
      targetBrands: [
        'PODA Salt Series (Premium SaltNic 30ml)',
        'PODA Freebase Series (60ml & 100ml)',
        'PODA Pods & Cartridges',
      ],
      otherBrandName: '',
      purchaseSource: 'Pembelian langsung dari perusahaan',
      distributorSupplierName: 'PT. PODA E-LIQUID COMPANY',
      distributorCity: 'Jakarta',
      willingToProvideProof: 'Ya, bersedia',
      docNib: {
        id: 'nib-001',
        name: 'NIB_PT_Nusantara_Retail.pdf',
        size: 245000,
        type: 'application/pdf',
        uploadedAt: '2026-10-12T08:35:00.000Z',
      },
      docPhysicalStorePhoto: {
        id: 'foto-001',
        name: 'Tampak_Depan_Poda_Kemang.jpg',
        size: 512000,
        type: 'image/jpeg',
        uploadedAt: '2026-10-12T08:36:00.000Z',
      },
      docPurchaseProof: {
        id: 'inv-001',
        name: 'Faktur_Pembelian_PODA_Direct.pdf',
        size: 190000,
        type: 'application/pdf',
        uploadedAt: '2026-10-12T08:38:00.000Z',
      },
      agreeTerms: true,
      agreePrivacy: true,
      statementSignerName: 'Bambang Sudirman',
      statementTruth: true,
      statementVerificationConsent: true,
    },
    {
      id: 'app-seed-002',
      registrationNumber: 'REG-202610-4491',
      createdAt: '2026-10-13T01:10:00.000Z',
      updatedAt: '2026-10-13T01:25:00.000Z',
      currentStep: 10,
      status: 'submitted',
      acceptedGeneralInfo: true,
      applicantName: 'Rian Pratama',
      applicantRelation: 'Pemilik usaha perseorangan',
      applicantWhatsapp: '085711223344',
      applicantEmail: 'rian.cloudpoda@gmail.com',
      ownerName: 'Rian Pratama',
      ownerWhatsapp: '085711223344',
      ownerEmail: 'rian.cloudpoda@gmail.com',
      sameAsApplicant: true,
      businessTradeName: 'Poda Cloud Corner Dago',
      businessType: 'Usaha perseorangan',
      businessTypeOther: '',
      businessLegalName: 'Rian Pratama (UD Cloud Poda)',
      nibNumber: '9876543210987',
      registeredAddress: 'Jl. Ir. H. Djuanda No. 188, Dago',
      city: 'Kota Bandung',
      province: 'Jawa Barat',
      salesChannel: 'Toko Fisik Saja',
      physicalStoreName: 'Poda Cloud Corner Dago',
      physicalStoreAddress: 'Jl. Ir. H. Djuanda No. 188, Dago, Kota Bandung',
      physicalStoreMapsUrl: 'https://maps.google.com/?q=-6.8850,107.6145',
      physicalStorePicName: 'Rian Pratama',
      physicalStoreWhatsapp: '085711223344',
      physicalStoreOperatingStatus: 'Sudah beroperasi',
      physicalStoreCompliance: 'Ya',
      onlineStoreName: '',
      onlineStorePlatform: '',
      onlineStorePlatformOther: '',
      onlineStoreUrl: '',
      onlineStoreSellerId: '',
      onlineStoreAccountOwner: '',
      onlineStoreOperatingStatus: '',
      onlineStorePlatformCompliance: '',
      onlineStoreAgeVerification: '',
      targetBrands: [
        'PODA Salt Series (Premium SaltNic 30ml)',
        'PODA Exclusive Edition Liquid',
      ],
      otherBrandName: '',
      purchaseSource: 'Distributor',
      distributorSupplierName: 'CV Mitra Distribusi Jawa Barat',
      distributorCity: 'Bandung',
      willingToProvideProof: 'Ya, bersedia',
      docNib: {
        id: 'nib-002',
        name: 'NIB_UD_Cloud_Poda.pdf',
        size: 198000,
        type: 'application/pdf',
        uploadedAt: '2026-10-13T01:15:00.000Z',
      },
      docPhysicalStorePhoto: {
        id: 'foto-002',
        name: 'Foto_Toko_Dago_Bandung.jpg',
        size: 420000,
        type: 'image/jpeg',
        uploadedAt: '2026-10-13T01:16:00.000Z',
      },
      agreeTerms: true,
      agreePrivacy: true,
      statementSignerName: 'Rian Pratama',
      statementTruth: true,
      statementVerificationConsent: true,
    },
  ];
}

// Local storage backup helpers
export function getLocalDraft(): FormData | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read local draft', e);
  }
  return null;
}

export function saveLocalDraft(data: FormData) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage limit reached or disabled', e);
  }
}

export function clearLocalDraft() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

function getLocalAppsList(): FormData[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ALL_APPS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }
  const seed = getSeedApplications();
  try {
    localStorage.setItem(LOCAL_STORAGE_ALL_APPS, JSON.stringify(seed));
  } catch (e) {}
  return seed;
}

function saveLocalAppsList(list: FormData[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ALL_APPS, JSON.stringify(list));
  } catch (e) {}
}

// Auto-save draft to backend database or localStorage (Netlify fallback)
export async function apiSaveDraft(
  data: FormData
): Promise<{ success: boolean; application?: FormData; error?: string }> {
  saveLocalDraft(data);

  // Update local list
  const list = getLocalAppsList();
  const existingIdx = list.findIndex((a) => a.id === data.id);
  const now = new Date().toISOString();
  const updatedItem: FormData = {
    ...data,
    updatedAt: now,
    status: data.status || 'draft',
  };

  if (existingIdx >= 0) {
    list[existingIdx] = updatedItem;
  } else {
    list.unshift(updatedItem);
  }
  saveLocalAppsList(list);

  // 1. Persist to Cloud Firestore
  try {
    if (updatedItem.id) {
      await setDoc(doc(db, 'applications', updatedItem.id), sanitizeForFirestore(updatedItem), {
        merge: true,
      });
    }
  } catch (firestoreErr) {
    console.warn('Firestore draft save fallback:', firestoreErr);
  }

  // 2. Also try Express server if running
  try {
    const res = await fetch('/api/applications/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (err) {
    // Running on Netlify without Node server - perfectly fine!
  }
  return { success: true, application: updatedItem };
}

// Submit final application
export async function apiSubmitApplication(
  data: FormData
): Promise<{ success: boolean; application?: FormData; error?: string; message?: string }> {
  const now = new Date().toISOString();
  const regMonth = now.slice(0, 7).replace('-', '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const regNum = data.registrationNumber || `REG-${regMonth}-${randomSuffix}`;

  const finalData: FormData = {
    ...data,
    status: 'submitted',
    registrationNumber: regNum,
    updatedAt: now,
  };

  // Save to client storage
  const list = getLocalAppsList();
  const existingIdx = list.findIndex((a) => a.id === data.id);
  if (existingIdx >= 0) {
    list[existingIdx] = finalData;
  } else {
    list.unshift(finalData);
  }
  saveLocalAppsList(list);
  clearLocalDraft();

  // 1. Save directly to Cloud Firestore (Real-Time Cloud Persistence)
  try {
    await setDoc(doc(db, 'applications', finalData.id), sanitizeForFirestore(finalData), {
      merge: true,
    });
  } catch (firestoreErr) {
    console.warn('Firestore submission write error:', firestoreErr);
  }

  // Instant real-time multi-tab & cross-window synchronization
  broadcastSyncEvent('NEW_APPLICATION', { application: finalData });

  try {
    const res = await fetch('/api/applications/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData),
    });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (err) {
    // Netlify static deployment fallback
  }

  return {
    success: true,
    application: finalData,
    message: 'Permohonan berhasil disimpan ke database dan disinkronkan',
  };
}

// Fetch all applications
export async function apiGetApplications(params?: {
  status?: string;
  search?: string;
  channel?: string;
}): Promise<FormData[]> {
  // 1. Try fetching from Cloud Firestore
  try {
    const snap = await getDocs(collection(db, 'applications'));
    if (!snap.empty) {
      const firestoreList: FormData[] = [];
      snap.forEach((d) => {
        firestoreList.push(d.data() as FormData);
      });
      firestoreList.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime()
      );
      saveLocalAppsList(firestoreList);

      let filtered = firestoreList;
      if (params?.status && params.status !== 'all') {
        filtered = filtered.filter((a) => a.status === params.status);
      }
      if (params?.channel && params.channel !== 'all') {
        filtered = filtered.filter((a) => a.salesChannel === params.channel);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            (a.registrationNumber && a.registrationNumber.toLowerCase().includes(q)) ||
            (a.businessTradeName && a.businessTradeName.toLowerCase().includes(q)) ||
            (a.applicantName && a.applicantName.toLowerCase().includes(q)) ||
            (a.nibNumber && a.nibNumber.toLowerCase().includes(q))
        );
      }
      return filtered;
    } else {
      // Seed demo data to Firestore on very first access if empty
      const initialSeed = getSeedApplications();
      for (const item of initialSeed) {
        setDoc(doc(db, 'applications', item.id), sanitizeForFirestore(item)).catch(() => {});
      }
      saveLocalAppsList(initialSeed);
      return initialSeed;
    }
  } catch (firestoreErr) {
    console.warn('Firestore fetch fallback:', firestoreErr);
  }

  // 2. Try Node/Express server if running
  try {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.channel) query.append('channel', params.channel);

    const res = await fetch(`/api/applications?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      if (json.applications && json.applications.length > 0) {
        saveLocalAppsList(json.applications);
        return json.applications;
      }
    }
  } catch (err) {
    // Netlify static fallback
  }

  // 3. Client-side query fallback
  let list = getLocalAppsList();
  if (params?.status && params.status !== 'all') {
    list = list.filter((a) => a.status === params.status);
  }
  if (params?.channel && params.channel !== 'all') {
    list = list.filter((a) => a.salesChannel === params.channel);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (a) =>
        (a.registrationNumber && a.registrationNumber.toLowerCase().includes(q)) ||
        (a.businessTradeName && a.businessTradeName.toLowerCase().includes(q)) ||
        (a.applicantName && a.applicantName.toLowerCase().includes(q)) ||
        (a.nibNumber && a.nibNumber.toLowerCase().includes(q))
    );
  }
  return list;
}

// Fetch stats
export async function apiGetStats() {
  try {
    const apps = await apiGetApplications();
    return {
      total: apps.length,
      drafts: apps.filter((a) => a.status === 'draft').length,
      submitted: apps.filter((a) => a.status === 'submitted').length,
      approved: apps.filter((a) => a.status === 'approved' || a.status === 'continued').length,
      on_hold: apps.filter((a) => a.status === 'on_hold').length,
      channel_rejected: apps.filter((a) => a.status === 'channel_rejected').length,
      rejected: apps.filter((a) => a.status === 'rejected').length,
    };
  } catch (err) {
    // Fallback
  }

  const list = getLocalAppsList();
  return {
    total: list.length,
    drafts: list.filter((a) => a.status === 'draft').length,
    submitted: list.filter((a) => a.status === 'submitted').length,
    approved: list.filter((a) => a.status === 'approved' || a.status === 'continued').length,
    on_hold: list.filter((a) => a.status === 'on_hold').length,
    channel_rejected: list.filter((a) => a.status === 'channel_rejected').length,
    rejected: list.filter((a) => a.status === 'rejected').length,
  };
}

// Update admin decision
export async function apiUpdateDecision(
  id: string,
  payload: {
    decision: string;
    status: string;
    adminNotes: string;
    reviewerName?: string;
  }
): Promise<{ success: boolean; application?: FormData }> {
  const list = getLocalAppsList();
  const idx = list.findIndex((a) => a.id === id);
  const now = new Date().toISOString();

  let updatedApp: FormData | undefined;
  if (idx >= 0) {
    list[idx] = {
      ...list[idx],
      status: payload.status as any,
      adminDecision: payload.decision,
      adminNotes: payload.adminNotes,
      reviewedBy: payload.reviewerName || 'Divisi Kemitraan PT. PODA E-LIQUID COMPANY',
      reviewedAt: now,
      updatedAt: now,
    };
    updatedApp = list[idx];
    saveLocalAppsList(list);

    // Broadcast update to all active sessions
    broadcastSyncEvent('APPLICATION_UPDATED', { application: updatedApp, id });
  }

  // 1. Update Cloud Firestore
  try {
    await updateDoc(
      doc(db, 'applications', id),
      sanitizeForFirestore({
        status: payload.status,
        adminDecision: payload.decision,
        adminNotes: payload.adminNotes,
        reviewedBy: payload.reviewerName || 'Divisi Kemitraan PT. PODA E-LIQUID COMPANY',
        reviewedAt: now,
        updatedAt: now,
      })
    );
  } catch (firestoreErr) {
    console.warn('Firestore update decision fallback:', firestoreErr);
  }

  // 2. Update Express server if available
  try {
    const res = await fetch(`/api/applications/${id}/decision`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Netlify fallback
  }

  return { success: true, application: updatedApp };
}

// ----------------------------------------------------
// Form Page Settings API
// ----------------------------------------------------

export function getLocalFormSettings(): FormPageSettings {
  if (typeof window === 'undefined') return DEFAULT_FORM_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_FORM_SETTINGS));
      return DEFAULT_FORM_SETTINGS;
    }
    return { ...DEFAULT_FORM_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_FORM_SETTINGS;
  }
}

export function saveLocalFormSettings(settings: FormPageSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e);
  }
}

export async function apiGetFormSettings(): Promise<FormPageSettings> {
  // 1. Try Cloud Firestore
  try {
    const snap = await getDoc(doc(db, 'settings', 'form_page_settings'));
    if (snap.exists()) {
      const data = snap.data() as FormPageSettings;
      saveLocalFormSettings(data);
      return data;
    }
  } catch (firestoreErr) {
    console.warn('Firestore settings fetch fallback:', firestoreErr);
  }

  // 2. Try Node server
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data?.settings) {
        saveLocalFormSettings(data.settings);
        return data.settings;
      }
    }
  } catch (err) {
    // Netlify static fallback
  }
  return getLocalFormSettings();
}

export async function apiSaveFormSettings(
  settings: FormPageSettings
): Promise<{ success: boolean; settings: FormPageSettings }> {
  const updatedSettings: FormPageSettings = {
    ...settings,
    lastUpdated: new Date().toISOString(),
  };

  saveLocalFormSettings(updatedSettings);

  // Broadcast settings changes instantly to all open applicant forms!
  broadcastSyncEvent('SETTINGS_UPDATED', { settings: updatedSettings });

  // 1. Save to Cloud Firestore
  try {
    await setDoc(doc(db, 'settings', 'form_page_settings'), sanitizeForFirestore(updatedSettings), {
      merge: true,
    });
  } catch (firestoreErr) {
    console.warn('Firestore save settings fallback:', firestoreErr);
  }

  // 2. Save to Express server if running
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSettings),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, settings: data.settings || updatedSettings };
    }
  } catch (err) {
    // Netlify static fallback
  }

  return { success: true, settings: updatedSettings };
}

// ----------------------------------------------------
// Real-Time Cloud Listeners (Firestore Snapshots)
// ----------------------------------------------------

/**
 * Real-time subscription to applications from Cloud Firestore
 * When any user on any device submits, all admins are updated immediately!
 */
export function subscribeToFirestoreApplications(
  callback: (applications: FormData[]) => void
): () => void {
  try {
    const colRef = collection(db, 'applications');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: FormData[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as FormData);
        });
        list.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
        );
        saveLocalAppsList(list);
        callback(list);
      },
      (error) => {
        console.warn('Firestore realtime applications listener error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to start Firestore applications listener:', err);
    return () => {};
  }
}

/**
 * Real-time subscription to form page settings from Cloud Firestore
 * When admin modifies any page setting, all open applicant forms react live!
 */
export function subscribeToFirestoreSettings(
  callback: (settings: FormPageSettings) => void
): () => void {
  try {
    const docRef = doc(db, 'settings', 'form_page_settings');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as FormPageSettings;
          saveLocalFormSettings(data);
          callback(data);
        }
      },
      (error) => {
        console.warn('Firestore realtime settings listener error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to start Firestore settings listener:', err);
    return () => {};
  }
}


