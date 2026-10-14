import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  applications: any[];
  settings?: any;
}

function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading DB, re-initializing...', err);
  }
  return { applications: [] };
}

function writeDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Seed initial realistic data if database is empty
function seedDatabaseIfNeeded() {
  const db = readDb();
  if (!db.applications || db.applications.length === 0) {
    const seedData = [
      {
        id: 'seed-app-001',
        registrationNumber: 'REG-202610-9182',
        createdAt: '2026-10-12T09:30:00.000Z',
        updatedAt: '2026-10-12T10:15:00.000Z',
        currentStep: 10,
        status: 'approved',
        adminDecision: 'Dapat diajukan untuk persetujuan',
        adminNotes: 'Dokumen NIB valid, izin OSS aktif, lokasi toko berjarak >200m dari sekolah, verifikasi PIC lengkap.',
        reviewedAt: '2026-10-12T14:20:00.000Z',
        reviewedBy: 'Divisi Kemitraan PT. PODA E-LIQUID COMPANY',
        acceptedGeneralInfo: true,
        applicantName: 'Bambang Sudirman',
        applicantRelation: 'Pemilik usaha perseorangan',
        applicantWhatsapp: '081298765432',
        applicantEmail: 'bambang.sudirman@vapestore.co.id',
        ownerName: 'Bambang Sudirman',
        ownerWhatsapp: '081298765432',
        ownerEmail: 'bambang.sudirman@vapestore.co.id',
        sameAsApplicant: true,
        businessTradeName: 'Poda Vapor Store Sudirman',
        businessType: 'Perseroan Terbatas (PT)',
        businessTypeOther: '',
        businessLegalName: 'PT Nusantara Retail Mandiri',
        nibNumber: '1234567890123',
        registeredAddress: 'Jl. Jenderal Sudirman Kav. 52-53, Senayan',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        salesChannel: 'Toko Fisik dan Toko Online',
        physicalStoreName: 'Poda Vapor Lounge Flagship',
        physicalStoreAddress: 'Jl. Jenderal Sudirman Kav. 52-53, Senayan, Jakarta Selatan',
        physicalStoreMapsUrl: 'https://maps.google.com/?q=-6.2255,106.8095',
        physicalStorePicName: 'Bambang Sudirman',
        physicalStoreWhatsapp: '081298765432',
        physicalStoreOperatingStatus: 'Sudah beroperasi',
        physicalStoreCompliance: 'Ya',
        onlineStoreName: 'PodaLiquid_Official',
        onlineStorePlatform: 'Tokopedia',
        onlineStorePlatformOther: '',
        onlineStoreUrl: 'https://tokopedia.com/podaliquidofficial',
        onlineStoreSellerId: 'PODA-SHOP-88291',
        onlineStoreAccountOwner: 'PT Nusantara Retail Mandiri',
        onlineStoreOperatingStatus: 'Sudah aktif',
        onlineStorePlatformCompliance: 'Ya, berdasarkan ketentuan platform yang berlaku',
        onlineStoreAgeVerification: 'Ya',
        targetBrands: ['PODA Salt Series (Premium SaltNic 30ml)', 'PODA Freebase Series (60ml & 100ml)'],
        otherBrandName: '',
        purchaseSource: 'Pembelian langsung dari perusahaan',
        distributorSupplierName: 'PT. PODA E-LIQUID COMPANY (Pusat)',
        distributorCity: 'Jakarta',
        willingToProvideProof: 'Ya, bersedia',
        docNib: {
          id: 'nib-001',
          name: 'NIB_PT_Nusantara_Vapor.pdf',
          size: 245000,
          type: 'application/pdf',
          uploadedAt: '2026-10-12T09:40:00.000Z',
        },
        docPhysicalStorePhoto: {
          id: 'store-001',
          name: 'Foto_Tampak_Depan_Toko_Sudirman.jpg',
          size: 512000,
          type: 'image/jpeg',
          uploadedAt: '2026-10-12T09:42:00.000Z',
        },
        docOnlineStoreScreenshot: {
          id: 'online-001',
          name: 'Screenshot_Tokopedia_Official.png',
          size: 380000,
          type: 'image/png',
          uploadedAt: '2026-10-12T09:43:00.000Z',
        },
        docPurchaseProof: {
          id: 'inv-001',
          name: 'Invoice_Pembelian_Resmi_INV2026.pdf',
          size: 190000,
          type: 'application/pdf',
          uploadedAt: '2026-10-12T09:44:00.000Z',
        },
        agreeTerms: true,
        agreePrivacy: true,
        statementSignerName: 'Bambang Sudirman',
        statementTruth: true,
        statementVerificationConsent: true,
      },
      {
        id: 'seed-app-002',
        registrationNumber: 'REG-202610-4421',
        createdAt: '2026-10-13T01:10:00.000Z',
        updatedAt: '2026-10-13T01:25:00.000Z',
        currentStep: 10,
        status: 'submitted',
        acceptedGeneralInfo: true,
        applicantName: 'Dimas Aditya',
        applicantRelation: 'Pemilik usaha perseorangan',
        applicantWhatsapp: '085712349988',
        applicantEmail: 'dimas.vapebandung@gmail.com',
        ownerName: 'Dimas Aditya',
        ownerWhatsapp: '085712349988',
        ownerEmail: 'dimas.vapebandung@gmail.com',
        sameAsApplicant: true,
        businessTradeName: 'Clouds Corner Dago',
        businessType: 'Usaha perseorangan',
        businessTypeOther: '',
        businessLegalName: 'Dimas Aditya (UD Clouds Corner)',
        nibNumber: '9876543210987',
        registeredAddress: 'Jl. Ir. H. Djuanda No. 142, Dago',
        city: 'Kota Bandung',
        province: 'Jawa Barat',
        salesChannel: 'Toko Fisik Saja',
        physicalStoreName: 'Clouds Corner Dago',
        physicalStoreAddress: 'Jl. Ir. H. Djuanda No. 142, Dago, Bandung',
        physicalStoreMapsUrl: 'https://maps.google.com/?q=-6.8850,107.6145',
        physicalStorePicName: 'Dimas Aditya',
        physicalStoreWhatsapp: '085712349988',
        physicalStoreOperatingStatus: 'Sudah beroperasi',
        physicalStoreCompliance: 'Ya',
        targetBrands: ['Merek A (Pod Systems & Hardware)', 'Merek C (Disposable Devices & Accessories)'],
        otherBrandName: '',
        purchaseSource: 'Distributor',
        distributorSupplierName: 'CV Mitra Distribusi Jawa Barat',
        distributorCity: 'Bandung',
        willingToProvideProof: 'Ya, bersedia',
        docNib: {
          id: 'nib-002',
          name: 'NIB_Clouds_Corner_Dago.pdf',
          size: 185000,
          type: 'application/pdf',
          uploadedAt: '2026-10-13T01:15:00.000Z',
        },
        docPhysicalStorePhoto: {
          id: 'store-002',
          name: 'Toko_Fisik_Dago.jpg',
          size: 420000,
          type: 'image/jpeg',
          uploadedAt: '2026-10-13T01:16:00.000Z',
        },
        docPurchaseProof: {
          id: 'inv-002',
          name: 'Faktur_Mitra_Distributor_098.pdf',
          size: 210000,
          type: 'application/pdf',
          uploadedAt: '2026-10-13T01:18:00.000Z',
        },
        agreeTerms: true,
        agreePrivacy: true,
        statementSignerName: 'Dimas Aditya',
        statementTruth: true,
        statementVerificationConsent: true,
      },
    ];
    writeDb({ applications: seedData });
  }
}

seedDatabaseIfNeeded();

// --- REST API ENDPOINTS ---

// GET stats summary
app.get('/api/stats', (_req: Request, res: Response) => {
  const db = readDb();
  const applications = db.applications || [];
  const stats = {
    total: applications.length,
    drafts: applications.filter((a) => a.status === 'draft').length,
    submitted: applications.filter((a) => a.status === 'submitted').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    on_hold: applications.filter((a) => a.status === 'on_hold').length,
    channel_rejected: applications.filter((a) => a.status === 'channel_rejected').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };
  res.json({ success: true, stats });
});

// GET all applications
app.get('/api/applications', (req: Request, res: Response) => {
  const db = readDb();
  let list = db.applications || [];

  const { status, search, channel } = req.query;

  if (status && typeof status === 'string' && status !== 'all') {
    list = list.filter((app) => app.status === status);
  }

  if (channel && typeof channel === 'string' && channel !== 'all') {
    list = list.filter((app) => app.salesChannel === channel);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (app) =>
        (app.registrationNumber && app.registrationNumber.toLowerCase().includes(q)) ||
        (app.applicantName && app.applicantName.toLowerCase().includes(q)) ||
        (app.businessTradeName && app.businessTradeName.toLowerCase().includes(q)) ||
        (app.businessLegalName && app.businessLegalName.toLowerCase().includes(q)) ||
        (app.nibNumber && app.nibNumber.toLowerCase().includes(q)) ||
        (app.city && app.city.toLowerCase().includes(q))
    );
  }

  // Sort newest updated first
  list.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

  res.json({ success: true, count: list.length, applications: list });
});

// GET single application by ID
app.get('/api/applications/:id', (req: Request, res: Response) => {
  const db = readDb();
  const appFound = db.applications.find((a) => a.id === req.params.id);
  if (!appFound) {
    return res.status(404).json({ success: false, message: 'Data permohonan tidak ditemukan' });
  }
  res.json({ success: true, application: appFound });
});

// POST auto-save draft
app.post('/api/applications/draft', (req: Request, res: Response) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({ success: false, message: 'Data formulir tidak boleh kosong' });
  }

  const db = readDb();
  const id = body.id || `draft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const existingIndex = db.applications.findIndex((a) => a.id === id);

  const draftData = {
    ...body,
    id,
    updatedAt: now,
    status: body.status || 'draft',
    createdAt: existingIndex >= 0 ? db.applications[existingIndex].createdAt : now,
  };

  if (existingIndex >= 0) {
    db.applications[existingIndex] = draftData;
  } else {
    db.applications.unshift(draftData);
  }

  writeDb(db);
  res.json({ success: true, message: 'Draf berhasil disimpan otomatis ke database', application: draftData });
});

// POST submit final application
app.post('/api/applications/submit', (req: Request, res: Response) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({ success: false, message: 'Data tidak boleh kosong' });
  }

  const db = readDb();
  const now = new Date().toISOString();
  const id = body.id || `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Generate official registration number: REG-YYYYMM-XXXX
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const regMonth = now.slice(0, 7).replace('-', '');
  const registrationNumber = body.registrationNumber || `REG-${regMonth}-${randomSuffix}`;

  const existingIndex = db.applications.findIndex((a) => a.id === id);

  const finalData = {
    ...body,
    id,
    registrationNumber,
    status: 'submitted',
    updatedAt: now,
    createdAt: existingIndex >= 0 ? db.applications[existingIndex].createdAt : now,
  };

  if (existingIndex >= 0) {
    db.applications[existingIndex] = finalData;
  } else {
    db.applications.unshift(finalData);
  }

  writeDb(db);
  res.json({
    success: true,
    message: 'Permohonan pendaftaran reseller berhasil dikirim dan tersimpan di database',
    application: finalData,
  });
});

// PATCH internal admin decision (matching Page 20 rules)
app.patch('/api/applications/:id/decision', (req: Request, res: Response) => {
  const { decision, status, adminNotes, reviewerName } = req.body;
  const db = readDb();
  const index = db.applications.findIndex((a) => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data permohonan tidak ditemukan' });
  }

  const now = new Date().toISOString();
  db.applications[index] = {
    ...db.applications[index],
    status: status || db.applications[index].status,
    adminDecision: decision,
    adminNotes: adminNotes || '',
    reviewedAt: now,
    reviewedBy: reviewerName || 'Admin Sales & Compliance',
    updatedAt: now,
  };

  writeDb(db);
  res.json({
    success: true,
    message: 'Keputusan verifikasi admin berhasil disimpan',
    application: db.applications[index],
  });
});

// DELETE application
app.delete('/api/applications/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.applications.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
  }

  db.applications.splice(index, 1);
  writeDb(db);
  res.json({ success: true, message: 'Data berhasil dihapus dari database' });
});

// GET form settings
app.get('/api/settings', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, settings: db.settings || null });
});

// POST form settings
app.post('/api/settings', (req: Request, res: Response) => {
  const db = readDb();
  db.settings = req.body;
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// Mount Vite or static dist in fullstack mode
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
