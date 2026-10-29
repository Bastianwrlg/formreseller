import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';

export const firebaseConfig = {
  projectId: rawConfig?.projectId || 'northern-rig-rgbcx',
  appId: rawConfig?.appId || '1:551607072736:web:29beb2f1099fd2c01d9d85',
  apiKey: rawConfig?.apiKey || 'AIzaSyDNCvgK9gAwFeBC6lY_mcm_FY_mlM00a2I',
  authDomain: rawConfig?.authDomain || 'northern-rig-rgbcx.firebaseapp.com',
  firestoreDatabaseId:
    rawConfig?.firestoreDatabaseId ||
    'ai-studio-salesflowformbui-98cbd6e0-5c65-4e9b-bf43-f4afa3a66b12',
  storageBucket: rawConfig?.storageBucket || 'northern-rig-rgbcx.firebasestorage.app',
  messagingSenderId: rawConfig?.messagingSenderId || '551607072736',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export { app };
