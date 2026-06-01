import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Configuración del proyecto Firebase "Gran Rifa"
const firebaseConfig = {
  apiKey: "AIzaSyCQhdBVPyMJwlj2eKSX83PP2pKIJr9gWqU",
  authDomain: "gran-rifa-500.firebaseapp.com",
  projectId: "gran-rifa-500",
  storageBucket: "gran-rifa-500.firebasestorage.app",
  messagingSenderId: "408417055109",
  appId: "1:408417055109:web:775d73659f4f9e5daed4ec"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Exportar Firestore
export const db = getFirestore(app)
