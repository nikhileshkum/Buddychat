import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { 
  getFirestore,
  enableIndexedDbPersistence,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC8Sa5efGJ9QhwSoFjyuCaeKxStbFY8lMg",
  authDomain: "buddybeam-3b0b4.firebaseapp.com",
  projectId: "buddybeam-3b0b4",
  storageBucket: "buddybeam-3b0b4.appspot.com",
  messagingSenderId: "1030798600435",
  appId: "1:1030798600435:web:3ed006ae331d91e8ceef86",
  measurementId: "G-JGJFEJ7XVN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// Initialize Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Storage
const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Offline persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('Current browser does not support offline persistence');
    }
  });

// Initialize Analytics (if supported)
let analytics;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});

export { 
  db, 
  auth, 
  storage, 
  googleProvider,
  analytics,
  signInWithPopup,
  signOut
};