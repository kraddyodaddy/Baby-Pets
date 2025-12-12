import React from 'react';

const ExampleItem = ({ original, result, name, delay }: { original: string, result: string, name: string, delay: string }) => (
  <div className="flex flex-col items-center space-y-2 animate-fade-in" style={{ animationDelay: delay }}>
    <div className="flex items-center space-x-2 sm:space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:scale-105 duration-300">
      <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 group">
        <img src={original} alt={`Adult ${name}`} className="w-full h-full object-cover rounded-xl" />
        <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[8px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">Adult</div>
      </div>
      
      <div className="text-brand-300 flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </div>

      <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0">
        <img src={result} alt={`Baby ${name}`} className="w-full h-full object-cover rounded-xl shadow-inner" />
        <div className="absolute bottom-1 right-1 bg-brand-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm shadow-sm">Baby</div>
      </div>
    </div>
    <span className="text-xs font-display font-bold text-gray-400 tracking-wide">{name}</span>
  </div>
);

export const Examples = () => {
  return (
    <div className="w-full max-w-2xl mx-auto py-6">
        <div className="flex items-center justify-center space-x-2 mb-6 opacity-80">
            <div className="h-px w-8 bg-brand-200"></div>
            <p className="text-center text-xs font-bold text-brand-400 uppercase tracking-widest">See the magic</p>
            <div className="h-px w-8 bg-brand-200"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 justify-items-center px-4">
            <ExampleItem 
                original="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80" 
                result="https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=300&q=80"
                name="COOPER"
                delay="0ms"
            />
            <ExampleItem 
                original="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80" 
                result="https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=300&q=80"
                name="LUNA"
                delay="150ms"
            />
        </div>
    </div>
  );
};