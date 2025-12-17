
import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Uploader } from './components/Uploader';
import { ComparisonCard } from './components/ComparisonCard';
import { Footer } from './components/Footer';
import { TermsPage, PrivacyPage, FAQPage, ContactPage, AboutPage } from './components/Legal';
import { GalleryPage } from './components/Gallery';
import { Showcase } from './components/Examples';
import { AdminDashboard } from './components/Admin';
import { generateBabyPet } from './services/geminiService';
import type { UploadedImage, TransformationResult } from './types';
import { MagicIcon } from './components/Icons';

const MAX_DAILY_GENERATIONS = 10;
const CONCURRENCY_LIMIT = 1; 

interface QueueItem {
  id: string;
  styleVariant?: string;
}

type ViewState = 'home' | 'terms' | 'privacy' | 'faq' | 'contact' | 'about' | 'gallery' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [results, setResults] = useState<Record<string, TransformationResult>>({});
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeRequests, setActiveRequests] = useState(0);

  const [usageCount, setUsageCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const storedDate = localStorage.getItem('babyPets_lastUsageDate');
    const storedCount = localStorage.getItem('babyPets_usageCount');
    const today = new Date().toDateString();
    if (storedDate !== today) return 0;
    return parseInt(storedCount || '0', 10);
  });

  const incrementUsage = useCallback(() => {
    const today = new Date().toDateString();
    setUsageCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem('babyPets_usageCount', newCount.toString());
      localStorage.setItem('babyPets_lastUsageDate', today);
      return newCount;
    });
  }, []);

  const handleNavigate = useCallback((view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (queue.length === 0 || activeRequests >= CONCURRENCY_LIMIT) return;
    const itemToProcess = queue[0];
    setQueue(prev => prev.slice(1));
    setActiveRequests(prev => prev + 1);

    const processItem = async () => {
      setResults((prev: Record<string, TransformationResult>) => ({
        ...prev,
        [itemToProcess.id]: { originalId: itemToProcess.id, generatedImageUrl: null, status: 'loading' }
      }));

      const upload = uploads.find(u => u.id === itemToProcess.id);
      if (upload) {
        try {
          const generatedImage = await generateBabyPet(upload.file, upload.petName, itemToProcess.styleVariant);
          setResults((prev: Record<string, TransformationResult>) => ({
            ...prev,
            [itemToProcess.id]: { originalId: itemToProcess.id, generatedImageUrl: generatedImage, status: 'success' }
          }));
          incrementUsage();
        } catch (err: any) {
          setResults((prev: Record<string, TransformationResult>) => ({
            ...prev,
            [itemToProcess.id]: { originalId: itemToProcess.id, generatedImageUrl: null, status: 'error', error: err.message }
          }));
        }
      }
      setActiveRequests(prev => prev - 1);
    };
    processItem();
  }, [queue, activeRequests, uploads, incrementUsage]);

  const handleFilesSelected = useCallback((files: File[]) => {
    if (uploads.length >= 1) return;
    const newUploads: UploadedImage[] = files.slice(0, 1).map(file => ({
      id: uuidv4(),
      file,
      previewUrl: URL.createObjectURL(file),
      petName: ''
    }));
    setUploads(prev => [...prev, ...newUploads]);
  }, [uploads.length]);

  const handleRemove = useCallback((id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
    setResults(prev => { const n = { ...prev }; delete n[id]; return n; });
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleNameChange = useCallback((id: string, name: string) => {
    setUploads(prev => prev.map(u => u.id === id ? { ...u, petName: name } : u));
  }, []);

  const handleTransformAll = () => {
    if (usageCount >= MAX_DAILY_GENERATIONS) return;
    const pendingItems = uploads.filter(u => !results[u.id] || (results[u.id].status !== 'success' && results[u.id].status !== 'loading' && !queue.some(q => q.id === u.id)));
    if (pendingItems.length === 0 || uploads.some(u => !u.petName.trim())) return;
    
    setResults(prev => {
      const next = { ...prev };
      pendingItems.forEach(u => next[u.id] = { originalId: u.id, generatedImageUrl: null, status: 'queued' });
      return next;
    });
    setQueue(prev => [...prev, ...pendingItems.map(u => ({ id: u.id }))]);
  };

  const isLimitReached = usageCount >= MAX_DAILY_GENERATIONS;
  const remainingGenerations = Math.max(0, MAX_DAILY_GENERATIONS - usageCount);

  const renderMainContent = () => {
    if (currentView === 'terms') return <TermsPage />;
    if (currentView === 'privacy') return <PrivacyPage />;
    if (currentView === 'faq') return <FAQPage />;
    if (currentView === 'contact') return <ContactPage />;
    if (currentView === 'about') return <AboutPage />;
    if (currentView === 'gallery') return <GalleryPage onNavigate={handleNavigate} />;
    if (currentView === 'admin') return <AdminDashboard />;

    if (uploads.length === 0) {
      return (
        <div className="flex-1 w-full flex flex-col animate-fade-in">
           <div className="w-full max-w-7xl mx-auto px-4 pt-10 flex flex-col items-center justify-center">
              <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-700 mb-8 text-center leading-tight">
                See Your Pet as a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  Baby Pet Again
                </span>
              </h1>
              <Uploader onFilesSelected={handleFilesSelected} count={uploads.length} disabled={activeRequests > 0} />
              
              <div className="mt-4 px-6 py-2 bg-white rounded-full shadow-sm border border-brand-100 flex items-center space-x-2">
                 <span className={`w-2 h-2 rounded-full ${remainingGenerations > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                 <p className="text-sm font-bold text-gray-500">
                    {remainingGenerations} free generations remaining today
                 </p>
              </div>

              <Showcase />
           </div>
        </div>
      );
    }

    return (
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in flex flex-col">
         <div className="flex-1 min-h-0 mb-8">
           {uploads.map(u => (
              <ComparisonCard 
                key={u.id} upload={u} result={results[u.id]} 
                onRemove={handleRemove} onNameChange={handleNameChange} 
                onRegenerate={(id) => setQueue(q => [...q, { id }])}
                isLimitReached={isLimitReached}
              />
           ))}
         </div>
         <div className="flex flex-col items-center space-y-4">
            <button 
              onClick={handleTransformAll}
              disabled={isLimitReached || uploads.some(u => !u.petName.trim()) || activeRequests > 0}
              className={`px-10 py-5 rounded-full font-display font-black text-xl shadow-xl transition-all ${isLimitReached ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 active:scale-95'}`}
            >
              {activeRequests > 0 ? "Transforming..." : "Transform into Baby Pet"}
            </button>
            <p className="text-sm font-bold text-gray-400">
               {remainingGenerations} left for today
            </p>
         </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-pastel-cream">
      <header className="bg-white/80 h-20 flex items-center z-50 sticky top-0 border-b border-brand-100">
        <div className="max-w-5xl mx-auto px-4 flex-1 flex items-center justify-between">
          <button onClick={() => handleNavigate('home')} className="font-display text-2xl font-bold flex items-center">
            <span className="mr-2">🐶🐱✨</span> Baby<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Pets</span>
          </button>
          <nav className="flex items-center space-x-6">
            <div className="flex flex-col items-end">
              <button 
                onClick={() => handleNavigate('gallery')} 
                className="text-2xl font-display font-bold text-gray-700 hover:text-pastel-pink transition-colors leading-none"
              >
                Gallery
              </button>
              <span className="text-[10px] font-bold text-pastel-pink whitespace-nowrap">
                See more adorable pets!
              </span>
            </div>
            <button onClick={() => handleNavigate('admin')} className="text-[8px] text-gray-200 hover:text-gray-400 self-start mt-1">Admin</button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{renderMainContent()}</main>
      <Footer onNavigate={handleNavigate} currentView={currentView} />
    </div>
  );
}

export default App;
