import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions'; // Importante ter isso

// Sua configuração (mantenha a que você já colocou)
const firebaseConfig = {
  apiKey: "AIzaSyB609m5EesRtplFZ95MxRTyEOcxU2GYG7k",
  authDomain: "empresa-site-prod.firebaseapp.com",
  projectId: "empresa-site-prod",
  storageBucket: "empresa-site-prod.firebasestorage.app",
  messagingSenderId: "915627492614",
  appId: "1:915627492614:web:2e8d96d2a7080f81690a87",
  measurementId: "G-PNR2PT72PK"
};

const app = initializeApp(firebaseConfig);

// EXPORTAÇÕES OBRIGATÓRIAS
export const db = getFirestore(app);
export const functions = getFunctions(app); // <--- Essa linha é crucial para o erro sumir