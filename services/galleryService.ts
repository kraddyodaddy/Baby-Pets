export interface GalleryItem {
  id: string;
  petName: string;
  originalImage: string; // Base64
  babyImage: string; // Base64 or URL
  timestamp: number;
}

const STORAGE_KEY = 'babyPets_public_gallery';
const MAX_GALLERY_ITEMS = 20;

export const getGallery = (): GalleryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load gallery", e);
    return [];
  }
};

export const addToGallery = (item: GalleryItem) => {
  try {
    const currentGallery = getGallery();
    
    // Add new item to the beginning
    const updatedGallery = [item, ...currentGallery];
    
    // Enforce limit: Keep only the newest MAX_GALLERY_ITEMS
    const trimmedGallery = updatedGallery.slice(0, MAX_GALLERY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedGallery));
  } catch (e) {
    console.error("Failed to save to gallery", e);
    throw new Error("Could not save to gallery storage.");
  }
};

export const removeFromGallery = (id: string) => {
  try {
    const currentGallery = getGallery();
    const updatedGallery = currentGallery.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGallery));
    return updatedGallery;
  } catch (e) {
    console.error("Failed to remove from gallery", e);
    throw new Error("Could not remove from gallery.");
  }
};