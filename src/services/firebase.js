import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC9SZOdtse4S3mwtC_SwUUdoYKpuGsAeQA",
  authDomain: "shinny-woman-store.firebaseapp.com",
  projectId: "shinny-woman-store",
  storageBucket: "shinny-woman-store.firebasestorage.app",
  messagingSenderId: "30589985607",
  appId: "1:30589985607:web:d729a7ae12bb17bf686262"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)