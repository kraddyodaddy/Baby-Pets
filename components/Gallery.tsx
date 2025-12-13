import React, { useEffect, useState } from 'react';
import { getGallery, GalleryItem } from '../services/galleryService';
import { EXAMPLES } from './Examples';

export const GalleryPage = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    // Load gallery items from local storage
    const storedItems = getGallery();

    // Map the static examples to the GalleryItem format
    const exampleItems: GalleryItem[] = EXAMPLES.map((ex, i) => ({
      id: `featured-example-${i}`,
      petName: ex.name.replace('Baby ', ''), // Remove prefix for consistency if needed, or keep it.
      originalImage: '', // Signal that there is no original image
      babyImage: ex.src,
      timestamp: Date.now() // Use current time or 0
    }));

    // Combine stored items and example items
    // We place stored (user) items first, then examples at the bottom
    setItems([...storedItems, ...exampleItems]);
  }, []);

  return (
    <div className="w-full animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center py-12 px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Community <span className="text-brand-500">Gallery</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          See the adorable baby transformations shared by our community!
        </p>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto mx-4">
          <div className="text-6xl mb-4">🐶</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No photos yet!</h3>
          <p className="text-gray-500 mb-8">Be the first to share your baby pet transformation.</p>
          <button 
            onClick={() => onNavigate('home')}
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1"
          >
            Create a Baby Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              {/* Image Area */}
              <div className="flex h-48 sm:h-56 md:h-64">
                {item.originalImage ? (
                  /* Comparison View (User Generated) */
                  <>
                    <div className="w-1/2 relative bg-gray-50 flex items-center justify-center border-r border-gray-100">
                      <img 
                        src={item.originalImage} 
                        alt="Original" 
                        className="w-full h-full object-contain" 
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">Before</div>
                    </div>
                    <div className="w-1/2 relative bg-brand-50 flex items-center justify-center">
                      <img 
                        src={item.babyImage} 
                        alt="Baby Version" 
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 right-2 bg-brand-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">After</div>
                    </div>
                  </>
                ) : (
                  /* Full Width View (Featured Examples) */
                  <div className="w-full relative bg-gradient-to-br from-brand-50 to-pastel-purple/10 flex items-center justify-center">
                    <img 
                      src={item.babyImage} 
                      alt="Baby Version" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 text-brand-500 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-sm uppercase tracking-wide">
                      Featured
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer info */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-800">
                    Baby {item.petName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {item.originalImage ? new Date(item.timestamp).toLocaleDateString() : 'Featured'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-400 flex items-center justify-center">
                   ❤️
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Bottom */}
      {items.length > 0 && (
        <div className="text-center mt-16">
           <button 
            onClick={() => onNavigate('home')}
            className="bg-white border-2 border-brand-500 text-brand-600 hover:bg-brand-50 font-bold py-3 px-8 rounded-full shadow-md transition-transform hover:-translate-y-1"
          >
            Create Your Own
          </button>
        </div>
      )}
    </div>
  );
};