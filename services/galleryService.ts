import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  writeBatch
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadString, 
  getDownloadURL,
  deleteObject
} from "firebase/storage";

export interface GalleryItem {
  id: string;
  petName: string;
  originalImage: string; // URL
  babyImage: string; // URL
  timestamp: any;
}

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "babypets-ai.firebaseapp.com",
  projectId: "babypets-ai",
  storageBucket: "babypets-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Singleton initialization pattern to avoid "Firebase App named '[DEFAULT]' already exists" error
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Safe service accessor to prevent "Service not available" errors
const getDb = () => {
  try {
    return getFirestore(app);
  } catch (e) {
    console.error("Firestore initialization failed:", e);
    return null;
  }
};

const getStore = () => {
  try {
    return getStorage(app);
  } catch (e) {
    console.error("Storage initialization failed:", e);
    return null;
  }
};

const COLLECTION_NAME = "public_gallery";
const STATS_COLLECTION = "stats";
const DAILY_DOC_ID = "daily_tracking";

const MAX_COMMUNITY_ITEMS = 1500;
const DELETE_CHUNK_SIZE = 500;
const GLOBAL_DAILY_LIMIT = 100;

export const FEATURED_PETS: GalleryItem[] = [
  { id: 'f1', petName: 'Mochi', originalImage: '', babyImage: 'https://i.ibb.co/qMkskHsB/mochi-cat.jpg', timestamp: 1 },
  { id: 'f2', petName: 'Addie', originalImage: '', babyImage: 'https://i.ibb.co/Fq85Ccwt/addie-dog.jpg', timestamp: 2 },
  { id: 'f3', petName: 'Mimoette', originalImage: '', babyImage: 'https://i.ibb.co/jvXw4rpy/mimoette-cat.jpg', timestamp: 3 },
  { id: 'f4', petName: 'Peanut', originalImage: '', babyImage: 'https://i.ibb.co/7NyRgNBk/peanut-cat.jpg', timestamp: 4 },
  { id: 'f5', petName: 'Bling', originalImage: '', babyImage: 'https://i.ibb.co/TDvFJ8jR/bling-cat.jpg', timestamp: 5 },
  { id: 'f6', petName: 'Echo', originalImage: '', babyImage: 'https://i.ibb.co/vCGbQM4B/echo-dog.jpg', timestamp: 6 },
  { id: 'f7', petName: 'Thyme', originalImage: '', babyImage: 'https://i.ibb.co/k23jLtrY/thyme-dog.jpg', timestamp: 7 },
  { id: 'f8', petName: 'Nola', originalImage: '', babyImage: 'https://i.ibb.co/yzPg3Yc/nola-dog.jpg', timestamp: 8 },
];

export const checkGlobalDailyLimit = async (): Promise<boolean> => {
  const db = getDb();
  if (!db) return true;
  
  const today = new Date().toDateString();
  const dailyRef = doc(db, STATS_COLLECTION, DAILY_DOC_ID);
  
  try {
    const dailySnap = await getDoc(dailyRef);
    if (!dailySnap.exists() || dailySnap.data().date !== today) {
      try {
        await setDoc(dailyRef, { date: today, count: 0 }, { merge: true });
      } catch (e) {
        console.warn("Permission denied initializing daily tracking.", e);
      }
      return true;
    }
    return dailySnap.data().count < GLOBAL_DAILY_LIMIT;
  } catch (e: any) {
    console.warn("Firestore access restricted.", e);
    return true; 
  }
};

const runAutoCleanup = async () => {
  const db = getDb();
  const storage = getStore();
  if (!db || !storage) return;

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.size > MAX_COMMUNITY_ITEMS) {
      const toDelete = snapshot.docs.slice(0, DELETE_CHUNK_SIZE);
      const batch = writeBatch(db);

      for (const docSnap of toDelete) {
        const data = docSnap.data();
        batch.delete(docSnap.ref);
        try {
          const timestampId = data.timestamp?.toMillis() || Date.now();
          const origRef = ref(storage, `gallery/${timestampId}_original.jpg`);
          const babyRef = ref(storage, `gallery/${timestampId}_baby.jpg`);
          await deleteObject(origRef).catch(() => {}); 
          await deleteObject(babyRef).catch(() => {});
        } catch (storageErr) { }
      }
      await batch.commit();
    }
  } catch (e) {
    console.warn("Auto-cleanup error:", e);
  }
};

export const getGallery = async (): Promise<GalleryItem[]> => {
  const db = getDb();
  if (!db) return [];

  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy("timestamp", "desc"), 
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const items: GalleryItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as GalleryItem);
    });
    return items;
  } catch (e: any) {
    console.error("Firestore read error:", e);
    return [];
  }
};

export const addToGallery = async (item: Omit<GalleryItem, 'id'>) => {
  const db = getDb();
  const storage = getStore();
  if (!db || !storage) throw new Error("Cloud services currently unavailable.");

  const canUpload = await checkGlobalDailyLimit();
  if (!canUpload) {
    throw new Error("Community daily upload limit reached. Please try again tomorrow!");
  }

  try {
    const timestampId = Date.now();
    
    // 1. Upload to Storage
    const originalRef = ref(storage, `gallery/${timestampId}_original.jpg`);
    await uploadString(originalRef, item.originalImage, 'data_url');
    const originalUrl = await getDownloadURL(originalRef);

    const babyRef = ref(storage, `gallery/${timestampId}_baby.jpg`);
    await uploadString(babyRef, item.babyImage, 'data_url');
    const babyUrl = await getDownloadURL(babyRef);

    // 2. Save to Firestore
    await addDoc(collection(db, COLLECTION_NAME), {
      petName: item.petName,
      originalImage: originalUrl,
      babyImage: babyUrl,
      timestamp: Timestamp.now()
    });

    // 3. Increment Daily Count (Best effort)
    const dailyRef = doc(db, STATS_COLLECTION, DAILY_DOC_ID);
    await updateDoc(dailyRef, { count: increment(1) }).catch(e => {
        console.warn("Stats document update restricted.");
    });

    runAutoCleanup();
    
  } catch (e: any) {
    console.error("Cloud gallery error:", e);
    throw new Error(e.message || "Failed to post to gallery.");
  }
};

export const getAdminStats = async () => {
  const db = getDb();
  if (!db) return null;

  try {
    const dailyRef = doc(db, STATS_COLLECTION, DAILY_DOC_ID);
    const dailySnap = await getDoc(dailyRef);
    const dailyCount = dailySnap.exists() ? dailySnap.data().count : 0;

    return {
      totalItems: "FIFO Active",
      limit: MAX_COMMUNITY_ITEMS,
      remaining: "...",
      dailyCount: dailyCount,
      dailyLimit: GLOBAL_DAILY_LIMIT,
      estimatedStorageMB: "..."
    };
  } catch (e) {
    return null;
  }
};