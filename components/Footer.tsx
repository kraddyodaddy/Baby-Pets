import React from 'react';

interface FooterProps {
  onNavigate: (view: any) => void;
  currentView: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentView }) => {
  const getLinkClass = (viewName: string) => {
    return `cursor-pointer transition-colors ${
      currentView === viewName 
        ? 'text-brand-500 font-bold' 
        : 'text-gray-500 hover:text-brand-500'
    }`;
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-auto w-full">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
        <div className="text-gray-400 text-sm font-medium order-2 md:order-1">
          © {new Date().getFullYear()} BabyPets. Made with Gemini 2.5.
        </div>
        
        <nav className="flex flex-wrap justify-center gap-6 text-sm order-1 md:order-2">
          <button onClick={() => onNavigate('terms')} className={getLinkClass('terms')}>
            Terms of Service
          </button>
          <button onClick={() => onNavigate('privacy')} className={getLinkClass('privacy')}>
            Privacy Policy
          </button>
          <button onClick={() => onNavigate('faq')} className={getLinkClass('faq')}>
            FAQ
          </button>
          <button onClick={() => onNavigate('contact')} className={getLinkClass('contact')}>
            Contact
          </button>
        </nav>
      </div>
    </footer>
  );
};