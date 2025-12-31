import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions'; 
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyB609m5EesRtplFZ95MxRTyEOcxU2GYG7k",
  authDomain: "empresa-site-prod.firebaseapp.com",
  projectId: "empresa-site-prod",
  storageBucket: "empresa-site-prod.firebasestorage.app",
  messagingSenderId: "915627492614",
  appId: "1:915627492614:web:2e8d96d2a7080f81690a87",
  measurementId: "G-PNR2PT72PK"
};

// 1. Inicializa o App
const app = initializeApp(firebaseConfig);

// 2. Inicializa e Exporta os serviços diretamente (A forma correta)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// 3. (Opcional) Se quiser exportar o 'app' também
export default app;