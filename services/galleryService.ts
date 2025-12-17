
import { initializeApp } from "firebase/app";
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
  writeBatch,
  deleteDoc
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const COLLECTION_NAME = "public_gallery";
const STATS_COLLECTION = "stats";
const DAILY_DOC_ID = "daily_tracking";

const MAX_COMMUNITY_ITEMS = 1500; // Trigger cleanup when we reach this
const DELETE_CHUNK_SIZE = 500;    // Number of items to delete in one cleanup
const GLOBAL_DAILY_LIMIT = 100;   // Max uploads per day across all users

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

/**
 * Global Daily Quota Check
 */
export const checkGlobalDailyLimit = async (): Promise<boolean> => {
  const today = new Date().toDateString();
  const dailyRef = doc(db, STATS_COLLECTION, DAILY_DOC_ID);
  
  try {
    const dailySnap = await getDoc(dailyRef);
    if (!dailySnap.exists() || dailySnap.data().date !== today) {
      await setDoc(dailyRef, { date: today, count: 0 });
      return true;
    }
    return dailySnap.data().count < GLOBAL_DAILY_LIMIT;
  } catch (e) {
    return true; // Default to allow if stats fail
  }
};

/**
 * FIFO Auto-Cleanup Worker
 * Deletes oldest 500 items if threshold reached
 */
const runAutoCleanup = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.size > MAX_COMMUNITY_ITEMS) {
      console.log(`Gallery size ${snapshot.size} exceeds threshold. Cleaning up oldest ${DELETE_CHUNK_SIZE} items...`);
      
      const toDelete = snapshot.docs.slice(0, DELETE_CHUNK_SIZE);
      const batch = writeBatch(db);

      for (const docSnap of toDelete) {
        const data = docSnap.data();
        
        // 1. Delete Firestore Record
        batch.delete(docSnap.ref);

        // 2. Attempt to delete Storage files (best effort)
        // Note: This requires knowing the file name or having the full URL
        try {
          const timestampId = data.timestamp?.toMillis() || Date.now();
          const origRef = ref(storage, `gallery/${timestampId}_original.jpg`);
          const babyRef = ref(storage, `gallery/${timestampId}_baby.jpg`);
          await deleteObject(origRef).catch(() => {}); 
          await deleteObject(babyRef).catch(() => {});
        } catch (storageErr) {
          // Ignore storage delete errors during batch
        }
      }

      await batch.commit();
      console.log("Auto-cleanup completed successfully.");
    }
  } catch (e) {
    console.error("Auto-cleanup failed:", e);
  }
};

export const getGallery = async (): Promise<GalleryItem[]> => {
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
  } catch (e) {
    return [];
  }
};

export const addToGallery = async (item: Omit<GalleryItem, 'id'>) => {
  // 1. Check Global Daily Limit
  const canUpload = await checkGlobalDailyLimit();
  if (!canUpload) {
    throw new Error("Community daily upload limit reached. Please try again tomorrow!");
  }

  try {
    const timestampId = Date.now();
    
    // 2. Upload to Storage
    const originalRef = ref(storage, `gallery/${timestampId}_original.jpg`);
    await uploadString(originalRef, item.originalImage, 'data_url');
    const originalUrl = await getDownloadURL(originalRef);

    const babyRef = ref(storage, `gallery/${timestampId}_baby.jpg`);
    await uploadString(babyRef, item.babyImage, 'data_url');
    const babyUrl = await getDownloadURL(babyRef);

    // 3. Save to Firestore
    await addDoc(collection(db, COLLECTION_NAME), {
      petName: item.petName,
      originalImage: originalUrl,
      babyImage: babyUrl,
      timestamp: Timestamp.now()
    });

    // 4. Increment Daily Count
    const dailyRef = doc(db, STATS_COLLECTION, DAILY_DOC_ID);
    await updateDoc(dailyRef, { count: increment(1) });

    // 5. Trigger Cleanup (Async background-ish)
    runAutoCleanup();
    
  } catch (e) {
    console.error("Cloud gallery error:", e);
    throw new Error("Failed to post. The gallery might be temporarily full.");
  }
};

/**
 * Admin Stats Fetcher
 */
export const getAdminStats = async () => {
  const q = query(collection(db, COLLECTION_NAME));
  const snap = await getDocs(q);
  const count = snap.size;
  
  const dailyRef = doc(db, STATS_COLLECTION, DAILY_DOC_ID);
  const dailySnap = await getDoc(dailyRef);
  const dailyCount = dailySnap.exists() ? dailySnap.data().count : 0;

  return {
    totalItems: count,
    limit: MAX_COMMUNITY_ITEMS,
    remaining: Math.max(0, MAX_COMMUNITY_ITEMS - count),
    dailyCount: dailyCount,
    dailyLimit: GLOBAL_DAILY_LIMIT,
    estimatedStorageMB: (count * 0.8).toFixed(1) // Assuming avg 0.8MB per pair
  };
};
