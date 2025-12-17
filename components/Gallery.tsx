import React, { useEffect, useState } from 'react';
import { getGallery, FEATURED_PETS, GalleryItem } from '../services/galleryService';
import { XMarkIcon } from './Icons';

export const GalleryPage = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setIsLoading(true);
    try {
      const communityItems = await getGallery();
      setItems(communityItems);
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in pb-12 bg-gray-50/30">
      {/* Header */}
      <div className="text-center py-20 px-4 bg-white border-b border-gray-100">
        <h1 className="font-display text-6xl md:text-9xl font-bold text-gray-900 mb-6 tracking-tight">
          Gallery
        </h1>
        <p className="text-2xl md:text-3xl text-brand-500 max-w-2xl mx-auto font-bold animate-soft-slide-up">
          See more adorable pets!
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Section */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <span className="text-2xl">⭐</span>
            <h2 className="text-2xl font-display font-bold text-gray-800">Featured Pets</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURED_PETS.map(pet => (
              <div key={pet.id} className="bg-white rounded-[2rem] shadow-sm border border-brand-100 overflow-hidden group">
                 <div className="aspect-square bg-brand-50 flex items-center justify-center p-2">
                    <img src={pet.babyImage} alt={pet.petName} className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                 </div>
                 <div className="p-4 text-center">
                    <h3 className="font-display font-bold text-gray-700">Baby {pet.petName}</h3>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Community Section */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="text-2xl">🌍</span>
          <h2 className="text-2xl font-display font-bold text-gray-800">Recently Transformed</h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-4"></div>
             <p className="text-gray-500 font-medium">Loading the gallery...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">The community wall is waiting!</h3>
            <p className="text-gray-500 mb-8">Be the first to share your baby pet transformation globally.</p>
            <button 
              onClick={() => onNavigate('home')}
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1"
            >
              Transform Your Pet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col relative group">
                {/* Image Area */}
                <div className="flex aspect-video sm:aspect-square md:aspect-video lg:aspect-square overflow-hidden bg-gray-50">
                  {item.originalImage ? (
                    <>
                      <div className="w-1/2 relative flex items-center justify-center border-r border-gray-100 bg-gray-50 p-1">
                        <img src={item.originalImage} alt="Original" className="w-full h-full object-contain" loading="lazy" />
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[8px] font-bold px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-widest">Original</div>
                      </div>
                      <div className="w-1/2 relative flex items-center justify-center bg-brand-50 p-1">
                        <img src={item.babyImage} alt="Baby Version" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                        <div className="absolute bottom-2 right-2 bg-brand-500/90 text-white text-[8px] font-bold px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-widest">Baby</div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full relative bg-gradient-to-br from-brand-50 to-pastel-purple/10 flex items-center justify-center p-2">
                      <img src={item.babyImage} alt="Baby Version" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                </div>
                
                {/* Card Footer */}
                <div className="p-6 flex items-center justify-between bg-white border-t border-gray-50">
                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-800">
                      Baby {item.petName}
                    </h3>
                    <p className="text-[10px] font-bold text-pastel-pink uppercase tracking-widest mt-1">
                      Community Creation
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shadow-inner group-hover:animate-bounce text-sm">
                     🐾
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-20 p-12 bg-gradient-to-r from-pastel-pink/10 to-pastel-blue/10 rounded-[3rem] border border-brand-100">
           <h3 className="font-display text-3xl font-bold text-gray-700 mb-6">See your pet on this wall?</h3>
           <button 
            onClick={() => onNavigate('home')}
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 px-12 rounded-full shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
          >
            Create Your Baby Pet
          </button>
        </div>
      </div>
    </div>
  );
};