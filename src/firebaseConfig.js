import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.QCLI_FIREBASE_API_KEY,
  authDomain: import.meta.env.QCLI_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.QCLI_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.QCLI_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.QCLI_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.QCLI_FIREBASE_APP_ID,
  measurementId: import.meta.env.QCLI_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//Analitycs
const analytics = getAnalytics(app)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

export { db, analytics }
