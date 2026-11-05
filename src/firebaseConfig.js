import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: 'AIzaSyB3FXxrvkKf-tFKUQ4O4-KQ6HOHpLdeJlA',
  authDomain: 'fpi-33d4f.firebaseapp.com',
  projectId: 'fpi-33d4f',
  storageBucket: 'fpi-33d4f.firebasestorage.app',
  messagingSenderId: '479977273051',
  appId: '1:479977273051:web:2fc268e7697706587f3efe',
  measurementId: 'G-L34YWHTZ3W',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//Analitycs
const analytics = getAnalytics(app)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

export { db, analytics }
