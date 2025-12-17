import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  Timestamp 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadString, 
  getDownloadURL 
} from "firebase/storage";

export interface GalleryItem {
  id: string;
  petName: string;
  originalImage: string; // URL
  babyImage: string; // URL
  timestamp: number;
}

// NOTE: In a real production environment, these would be in environment variables.
// Using project-aware placeholders that default to standard Google Cloud config.
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
const MAX_GALLERY_ITEMS = 50;

// Hardcoded initial pets to ensure the gallery is always populated
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

export const getGallery = async (): Promise<GalleryItem[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy("timestamp", "desc"), 
      limit(MAX_GALLERY_ITEMS)
    );
    const querySnapshot = await getDocs(q);
    const items: GalleryItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as GalleryItem);
    });
    return items;
  } catch (e) {
    console.error("Failed to fetch cloud gallery, falling back to empty community list", e);
    return [];
  }
};

export const addToGallery = async (item: Omit<GalleryItem, 'id'>) => {
  try {
    const timestampId = Date.now();
    
    // 1. Upload Original Image to Storage
    const originalRef = ref(storage, `gallery/${timestampId}_original.jpg`);
    await uploadString(originalRef, item.originalImage, 'data_url');
    const originalUrl = await getDownloadURL(originalRef);

    // 2. Upload Baby Image to Storage
    const babyRef = ref(storage, `gallery/${timestampId}_baby.jpg`);
    await uploadString(babyRef, item.babyImage, 'data_url');
    const babyUrl = await getDownloadURL(babyRef);

    // 3. Save metadata to Firestore
    await addDoc(collection(db, COLLECTION_NAME), {
      petName: item.petName,
      originalImage: originalUrl,
      babyImage: babyUrl,
      timestamp: Timestamp.now()
    });
    
  } catch (e) {
    console.error("Failed to save to cloud gallery", e);
    throw new Error("Could not save to public gallery. Please try again later.");
  }
};

// Placeholder for deletion - in a public gallery, this might require auth
export const removeFromGallery = async (id: string) => {
  console.warn("Delete requested for public item. Deletion is restricted to moderators.");
};