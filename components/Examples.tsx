import React from 'react';

const EXAMPLES = [
  { name: 'Baby Addie', src: 'https://i.ibb.co/FbW0vfwz/addie-dog.jpg', alt: 'Baby Addie - Dog transformation example' },
  { name: 'Baby Mochi', src: 'https://i.ibb.co/MDbrwWTg/mochi-cat.jpg', alt: 'Baby Mochi - Cat transformation example' },
  { name: 'Baby Mimoette', src: 'https://i.ibb.co/whKRpbyn/mimoette-cat.jpg', alt: 'Baby Mimoette - Cat transformation example' },
  { name: 'Baby Peanut', src: 'https://i.ibb.co/C32G6cL4/peanut-cat.jpg', alt: 'Baby Peanut - Cat transformation example' },
];

export const Showcase = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-700">See the Magic ✨</h2>
        </div>
        
        {/* Gradient Background Container */}
        <div className="w-full rounded-[2.5rem] p-6 md:p-10 bg-gradient-to-r from-pastel-pink via-pastel-purple to-pastel-blue shadow-xl">
            {/* Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                {EXAMPLES.map((item, index) => (
                    <div key={index} className="flex flex-col items-center group w-full">
                        {/* 
                           Image Container: 
                           - Used p-1.5 for a narrow, uniform white border on all sides.
                           - Used object-cover to make the image fill the square, cropping edges if needed to maximize size.
                        */}
                        <div className="w-full aspect-square bg-white rounded-3xl shadow-md overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl p-1.5 flex items-center justify-center">
                            <img 
                                src={item.src} 
                                alt={item.alt} 
                                className="w-full h-full object-cover rounded-2xl" 
                            />
                        </div>
                        {/* 
                            Updated Text Styling:
                            - Maintained large size.
                            - Added stronger drop-shadow (0.5 opacity) to make the white text 'brighter' (pop more) against the pastel background.
                        */}
                        <h3 className="mt-5 font-display font-bold text-white text-2xl md:text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] tracking-wide transition-transform duration-300 group-hover:scale-105">
                            {item.name}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="text-center mt-10">
             <p className="text-pastel-purple font-bold text-lg animate-pulse">See what others have created! 👆</p>
        </div>
    </div>
  );
};