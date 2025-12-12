import React from 'react';

const EXAMPLES = [
  { name: 'Baby Addie', src: '/public/addie_dog.jpg', alt: 'Baby Addie - Dog transformation example' },
  { name: 'Baby Mochi', src: '/public/mochi_cat.jpg', alt: 'Baby Mochi - Cat transformation example' },
  { name: 'Baby Mimoette', src: '/public/mimoette_cat.jpg', alt: 'Baby Mimoette - Cat transformation example' },
  { name: 'Baby Peanut', src: '/public/peanut_cat.jpg', alt: 'Baby Peanut - Cat transformation example' },
];

export const Showcase = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-8 md:py-10">
        <div className="text-center mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-700">See the Magic ✨</h2>
        </div>
        
        {/* Grid Layout: 2 columns on mobile (stacked 2x2), 4 columns on desktop (single row) */}
        {/* Constrained max-width to keep images smaller and centered */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {EXAMPLES.map((item, index) => (
                <div key={index} className="flex flex-col items-center group w-full">
                    <div className="w-full aspect-[4/5] bg-white rounded-3xl shadow-sm border border-brand-100 overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-pastel-purple">
                        <img 
                            src={item.src} 
                            alt={item.alt} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <h3 className="mt-2 font-display font-bold text-gray-600 text-sm md:text-base">{item.name}</h3>
                </div>
            ))}
        </div>
        
        <div className="text-center mt-6">
             <p className="text-pastel-purple font-medium text-sm animate-pulse">See what others have created! 👆</p>
        </div>
    </div>
  );
};