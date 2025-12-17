import React, { useMemo } from 'react';

export interface ExamplePet {
  name: string;
  src: string;
  original?: string;
  alt: string;
}

export const EXAMPLES: ExamplePet[] = [
  { 
    name: 'Baby Mochi', 
    src: 'https://i.ibb.co/qMkskHsB/mochi-cat.jpg', 
    original: 'https://i.ibb.co/MDbrwWTg/mochi-cat.jpg',
    alt: 'Baby Mochi cat' 
  },
  { 
    name: 'Baby Addie', 
    src: 'https://i.ibb.co/Fq85Ccwt/addie-dog.jpg', 
    original: 'https://i.ibb.co/FbW0vfwz/addie-dog.jpg',
    alt: 'Baby Addie dog' 
  },
  { 
    name: 'Baby Mimoette', 
    src: 'https://i.ibb.co/jvXw4rpy/mimoette-cat.jpg', 
    original: 'https://i.ibb.co/whKRpbyn/mimoette-cat.jpg',
    alt: 'Baby Mimoette cat' 
  },
  { 
    name: 'Baby Peanut', 
    src: 'https://i.ibb.co/7NyRgNBk/peanut-cat.jpg', 
    original: 'https://i.ibb.co/C32G6cL4/peanut-cat.jpg',
    alt: 'Baby Peanut cat' 
  },
  { 
    name: 'Baby Bling', 
    src: 'https://i.ibb.co/TDvFJ8jR/bling-cat.jpg', 
    alt: 'Baby Bling cat' 
  },
  { 
    name: 'Baby Echo', 
    src: 'https://i.ibb.co/vCGbQM4B/echo-dog.jpg', 
    alt: 'Baby Echo dog' 
  },
  { 
    name: 'Baby Thyme', 
    src: 'https://i.ibb.co/k23jLtrY/thyme-dog.jpg', 
    alt: 'Baby Thyme dog' 
  },
  { 
    name: 'Baby Nola', 
    src: 'https://i.ibb.co/yzPg3Yc/nola-dog.jpg', 
    alt: 'Baby Nola dog' 
  },
];

export const Showcase = () => {
  // Randomly select 4 items from the pool of 8 on mount
  const selectedExamples = useMemo(() => {
    return [...EXAMPLES]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-700">See the Magic ✨</h2>
        </div>
        
        <div className="w-full rounded-[2.5rem] p-6 md:p-10 bg-gradient-to-r from-pastel-pink via-pastel-purple to-pastel-blue shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                {selectedExamples.map((item, index) => (
                    <div key={index} className="flex flex-col items-center group w-full">
                        <div className="w-full aspect-square bg-white rounded-3xl shadow-md overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl p-1.5 flex items-center justify-center">
                            <img 
                                src={item.src} 
                                alt={item.alt} 
                                className="w-full h-full object-cover rounded-2xl" 
                                loading="lazy"
                            />
                        </div>
                        <h3 className="mt-5 font-display font-bold text-white text-2xl md:text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] tracking-wide transition-transform duration-300 group-hover:scale-105">
                            {item.name}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="text-center mt-10">
             <p className="text-pastel-purple font-bold text-lg animate-pulse">Puppies, Kittens, and Bunnies, Oh my!</p>
        </div>
    </div>
  );
};