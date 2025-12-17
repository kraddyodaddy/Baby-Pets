import React, { useEffect, useState } from 'react';
import { getGallery, removeFromGallery, GalleryItem } from '../services/galleryService';
import { EXAMPLES } from './Examples';
import { XMarkIcon } from './Icons';

export const GalleryPage = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = () => {
    // Load gallery items from local storage
    const storedItems = getGallery();

    // Map the static examples to the GalleryItem format
    const exampleItems: GalleryItem[] = EXAMPLES.map((ex, i) => ({
      id: `featured-example-${i}`,
      petName: ex.name.replace('Baby ', ''), 
      originalImage: ex.original || '', // Support comparison view for featured items too
      babyImage: ex.src,
      timestamp: 0 // Featured items have 0 timestamp to sort them if needed
    }));

    // Combine examples first (Featured) then user stored items
    setItems([...exampleItems, ...storedItems]);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this pet from your gallery?")) {
      removeFromGallery(id);
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="w-full animate-fade-in pb-12 bg-gray-50/30">
      {/* Header */}
      <div className="text-center py-16 px-4 bg-white border-b border-gray-100">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Pet <span className="text-brand-500">Showcase</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          The wall of cuteness! See the transformations shared by our community.
        </p>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const isFeatured = item.id.startsWith('featured-example');
              
              return (
                <div key={item.id} className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col relative group">
                  
                  {/* Delete Button - Only for user generated items */}
                  {!isFeatured && (
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 p-2.5 rounded-full shadow-sm backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                      title="Remove from gallery"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}

                  {/* Image Area - Aspect ratio container with background to frame the full image */}
                  <div className="flex aspect-video sm:aspect-square md:aspect-video lg:aspect-square overflow-hidden bg-gray-50">
                    {item.originalImage ? (
                      /* Comparison View */
                      <>
                        <div className="w-1/2 relative flex items-center justify-center border-r border-gray-100 bg-gray-50 p-1">
                          <img 
                            src={item.originalImage} 
                            alt="Original" 
                            className="w-full h-full object-contain" 
                            loading="lazy"
                          />
                          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded backdrop-blur-md uppercase tracking-widest">Original</div>
                        </div>
                        <div className="w-1/2 relative flex items-center justify-center bg-brand-50 p-1">
                          <img 
                            src={item.babyImage} 
                            alt="Baby Version" 
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute bottom-3 right-3 bg-brand-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded backdrop-blur-md uppercase tracking-widest">Baby Pet</div>
                        </div>
                      </>
                    ) : (
                      /* Full Width View (for those without originals) */
                      <div className="w-full relative bg-gradient-to-br from-brand-50 to-pastel-purple/10 flex items-center justify-center p-2">
                        <img 
                          src={item.babyImage} 
                          alt="Baby Version" 
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-4 right-4 bg-white/95 text-brand-500 text-[10px] font-black px-4 py-1.5 rounded-full shadow-md backdrop-blur-sm uppercase tracking-widest">
                          Baby Version
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Card Footer */}
                  <div className="p-6 flex items-center justify-between bg-white border-t border-gray-50">
                    <div>
                      <h3 className="font-display font-bold text-2xl text-gray-800">
                        Baby {item.petName}
                      </h3>
                      <p className="text-xs font-bold text-pastel-pink uppercase tracking-widest mt-1">
                        {isFeatured ? 'Featured Artist' : 'Community Creation'}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shadow-inner group-hover:animate-bounce">
                       🐾
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Call to Action Footer */}
        {items.length > 0 && (
          <div className="text-center mt-20 p-12 bg-gradient-to-r from-pastel-pink/10 to-pastel-blue/10 rounded-[3rem] border border-brand-100">
             <h3 className="font-display text-3xl font-bold text-gray-700 mb-6">Want to see your pet here?</h3>
             <button 
              onClick={() => onNavigate('home')}
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 px-12 rounded-full shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
            >
              Transform Your Pet Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};