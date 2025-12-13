import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Uploader } from './components/Uploader';
import { ComparisonCard } from './components/ComparisonCard';
import { Footer } from './components/Footer';
import { TermsPage, PrivacyPage, FAQPage, ContactPage, AboutPage } from './components/Legal';
import { GalleryPage } from './components/Gallery';
import { Showcase } from './components/Examples';
import { generateBabyPet } from './services/geminiService';
import type { UploadedImage, TransformationResult } from './types';
import { MagicIcon } from './components/Icons';

const MAX_DAILY_GENERATIONS = 10;
const CONCURRENCY_LIMIT = 1; // Process items one by one to simulate high demand queue

interface QueueItem {
  id: string;
  styleVariant?: string;
}

type ViewState = 'home' | 'terms' | 'privacy' | 'faq' | 'contact' | 'about' | 'gallery';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [results, setResults] = useState<Record<string, TransformationResult>>({});
  
  // Queue state
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeRequests, setActiveRequests] = useState(0);

  // Initialize usage count from localStorage
  const [usageCount, setUsageCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const storedDate = localStorage.getItem('babyPets_lastUsageDate');
    const storedCount = localStorage.getItem('babyPets_usageCount');
    const today = new Date().toDateString();
    
    // Reset if it's a new day
    if (storedDate !== today) {
      return 0;
    }
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

  // Navigation Handler
  const handleNavigate = useCallback((view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Queue Processing Worker
  useEffect(() => {
    if (queue.length === 0 || activeRequests >= CONCURRENCY_LIMIT) return;

    // Pop the next item
    const itemToProcess = queue[0];
    setQueue(prev => prev.slice(1)); // Remove from queue
    setActiveRequests(prev => prev + 1);

    const processItem = async () => {
      // Set status to loading
      setResults((prev: Record<string, TransformationResult>) => {
        const current = prev[itemToProcess.id];
        // Ensure we preserve existing data or provide defaults to match TransformationResult type
        const loadingState: TransformationResult = current 
            ? { ...current, status: 'loading' }
            : { originalId: itemToProcess.id, generatedImageUrl: null, status: 'loading' };
            
        return {
            ...prev,
            [itemToProcess.id]: loadingState
        };
      });

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
            [itemToProcess.id]: { 
              originalId: itemToProcess.id, 
              generatedImageUrl: null, 
              status: 'error', 
              error: err.message || "Failed to generate." 
            }
          }));
        }
      }
      // Finished processing
      setActiveRequests(prev => prev - 1);
    };

    processItem();

  }, [queue, activeRequests, uploads, incrementUsage]);

  const handleFilesSelected = useCallback((files: File[]) => {
    const remainingSlots = 1 - uploads.length;
    if (remainingSlots <= 0) return;

    const filesToAdd = files.slice(0, remainingSlots);
    const newUploads: UploadedImage[] = filesToAdd.map(file => ({
      id: uuidv4(),
      file,
      previewUrl: URL.createObjectURL(file),
      petName: ''
    }));

    setUploads(prev => [...prev, ...newUploads]);
  }, [uploads.length]);

  const handleRemove = useCallback((id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
    setResults(prev => {
      const newResults = { ...prev };
      delete newResults[id];
      return newResults;
    });
    // Remove from queue if it's there
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleNameChange = useCallback((id: string, name: string) => {
    setUploads(prev => prev.map(u => 
      u.id === id ? { ...u, petName: name } : u
    ));
  }, []);

  const handleStartOver = useCallback((id?: string) => {
    setUploads([]);
    setResults({});
    setQueue([]);
    setActiveRequests(0);
    setCurrentView('home');
  }, []);

  const isLimitReached = usageCount >= MAX_DAILY_GENERATIONS;
  const remainingGenerations = Math.max(0, MAX_DAILY_GENERATIONS - usageCount);

  const handleTransformAll = async () => {
    if (isLimitReached) return;

    // Find items that are pending (not successful, loading, or already queued)
    const pendingItems = uploads.filter(u => {
      const result = results[u.id];
      const status = result?.status;
      // Check if already in queue or processing
      const isInQueue = queue.some(item => item.id === u.id);
      return status !== 'success' && status !== 'loading' && !isInQueue;
    });

    if (pendingItems.length === 0) return;

    // Validate names
    if (uploads.some(u => !u.petName.trim())) {
      return; 
    }

    // Add to queue and set status to 'queued'
    setResults((prev: Record<string, TransformationResult>) => {
      const next = { ...prev };
      pendingItems.forEach(u => {
        next[u.id] = { originalId: u.id, generatedImageUrl: null, status: 'queued' };
      });
      return next;
    });

    const newQueueItems = pendingItems.map(u => ({ id: u.id }));
    setQueue(prev => [...prev, ...newQueueItems]);
  };

  const handleRegenerate = async (id: string, styleVariant?: string) => {
    if (usageCount >= MAX_DAILY_GENERATIONS) return;

    const upload = uploads.find(u => u.id === id);
    if (!upload) return;

    // Set status to queued
    setResults((prev: Record<string, TransformationResult>) => {
      const existing = prev[id];
      // Safely construct the queued state even if existing result is undefined
      const updated: TransformationResult = existing
        ? { ...existing, status: 'queued', error: undefined }
        : { originalId: id, generatedImageUrl: null, status: 'queued' };

      return {
        ...prev,
        [id]: updated
      };
    });

    // Add to queue
    setQueue(prev => [...prev, { id, styleVariant }]);
  };

  const hasPendingItems = uploads.some(u => {
    const result = results[u.id];
    const status = result?.status;
    const isInQueue = queue.some(item => item.id === u.id);
    return status !== 'success' && status !== 'loading' && status !== 'queued' && !isInQueue;
  });
  
  const allNamesFilled = uploads.length > 0 && uploads.every(u => u.petName.trim().length > 0);
  const hasSuccess = Object.values(results).some((r: TransformationResult) => r.status === 'success');
  const isProcessing = activeRequests > 0 || queue.length > 0;
  
  const isUploadMode = uploads.length > 0;

  // Render content based on current view
  const renderMainContent = () => {
    if (currentView === 'terms') return <TermsPage />;
    if (currentView === 'privacy') return <PrivacyPage />;
    if (currentView === 'faq') return <FAQPage />;
    if (currentView === 'contact') return <ContactPage />;
    if (currentView === 'about') return <AboutPage onNavigate={handleNavigate} />;
    if (currentView === 'gallery') return <GalleryPage onNavigate={handleNavigate} />;

    // Home View Logic
    if (!isUploadMode) {
      return (
        <div className="flex-1 w-full flex flex-col animate-fade-in">
           {/* Top Section: Intro + Uploader */}
           <div className="w-full max-w-7xl mx-auto px-4 pt-10 pb-8 flex flex-col items-center space-y-2 min-h-[300px] justify-center">
              {/* Intro Section */}
              <section className="text-center max-w-4xl mx-auto mb-8">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-700 mb-4 leading-tight">
                  See Your Pet as a <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink via-pastel-purple to-pastel-blue">
                    Baby Pet Again
                  </span>
                </h1>
              </section>

              {/* Upload Section */}
              <section className="max-w-xl mx-auto w-full mb-12 flex flex-col items-center">
                <Uploader 
                  onFilesSelected={handleFilesSelected} 
                  count={uploads.length} 
                  disabled={isProcessing}
                />
                
                <div className="mt-3 text-center text-sm text-gray-400 font-medium">
                   {remainingGenerations} free generations remaining today
                </div>
              </section>

              {/* Showcase Section - Now Below Upload */}
              <Showcase />
           </div>

           {/* SEO Content: Why Use BabyPets */}
           <section className="w-full max-w-3xl mx-auto px-6 pt-12 pb-12 text-center border-t border-brand-100">
             <h2 className="font-display text-2xl font-bold text-gray-700 mb-4">Why Use Our AI Baby Pet Generator?</h2>
             <p className="text-gray-500 leading-relaxed">
               BabyPets.ai is the easiest way to see your <strong>cat as a kitten</strong> or your <strong>dog as a puppy</strong> again. 
               Whether you have a rescue pet whose baby photos you missed, or you just want to see a cute reimagining of your best friend, 
               our <strong>free AI pet transformation</strong> tool creates high-quality, adorable results in seconds.
             </p>
           </section>

           {/* Additional SEO Paragraph */}
           <section className="w-full bg-pastel-pink-light/20 border-t border-pastel-pink/20 py-10">
              <div className="max-w-4xl mx-auto px-6 text-center">
                  <p className="text-gray-500 text-sm leading-7">
                    <strong>BabyPets.ai</strong> utilizes advanced artificial intelligence to perform <strong>pet age regression</strong>, transforming photos of adult dogs and cats into hyper-realistic <strong>puppies and kittens</strong>. 
                    Our free, secure, and fast <strong>AI pet generator</strong> preserves your pet's unique markings while creating adorable baby memories, making it the ultimate tool for pet lovers to relive the magic of their pet's early days.
                  </p>
              </div>
           </section>
        </div>
      );
    }

    // Upload Mode (Workspace)
    return (
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 flex flex-col items-center h-full py-2 md:py-4 animate-fade-in">
         {/* Card Container */}
         <div className="flex-1 w-full min-h-0 flex flex-col justify-start md:justify-center max-h-full px-1 md:px-0 overflow-y-auto md:overflow-hidden scroll-smooth">
           {uploads.map(upload => (
              <ComparisonCard 
                key={upload.id} 
                upload={upload} 
                result={results[upload.id]}
                onRemove={handleRemove}
                onNameChange={handleNameChange}
                onRegenerate={handleRegenerate}
                isLimitReached={isLimitReached}
                className="h-auto md:h-full shadow-lg border border-pastel-pink/30 shrink-0 mb-20 md:mb-0"
              />
           ))}
         </div>

         {/* Action Bar */}
         <div className="shrink-0 flex flex-col items-center justify-center w-full mt-2 md:mt-4 pb-2 z-20 px-4 md:px-0 bg-pastel-cream md:bg-transparent">
            {isLimitReached ? (
              <div className="bg-gray-100 border border-gray-200 text-gray-600 px-6 py-3 rounded-full font-medium text-sm md:text-base text-center shadow-sm w-full md:w-auto">
                Daily limit reached. Come back tomorrow.
              </div>
            ) : (
              <>
                <button
                  onClick={handleTransformAll}
                  disabled={!hasPendingItems || !allNamesFilled}
                  className={`
                    group relative flex items-center justify-center space-x-3 px-8 py-4 md:py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 w-full md:w-auto
                    ${!hasPendingItems || !allNamesFilled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-pastel-pink via-pastel-purple to-pastel-blue text-white hover:brightness-105'
                    }
                  `}
                >
                  {isProcessing && !hasPendingItems ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Adding to Queue...</span>
                      </>
                  ) : (
                      <>
                        <MagicIcon className="w-6 h-6 animate-pulse" />
                        <span>Transform into Baby Pet</span>
                      </>
                  )}
                </button>
              </>
            )}

            {hasSuccess && !isProcessing && (
              <button
                onClick={() => handleStartOver()}
                className="mt-3 flex items-center justify-center space-x-2 px-6 py-3 md:py-2 bg-white text-gray-500 border border-brand-200 rounded-full hover:bg-brand-50 hover:text-brand-600 hover:border-brand-300 transition-all shadow-sm font-medium text-sm w-full md:w-auto"
              >
                <span>See another baby pet</span>
              </button>
            )}
         </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col font-sans text-gray-700 bg-pastel-cream min-h-screen ${isUploadMode && currentView === 'home' ? 'h-[100dvh] overflow-hidden' : ''}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-brand-100 shrink-0 h-16 flex items-center z-50 sticky top-0">
        <div className="max-w-5xl mx-auto px-4 flex-1 flex items-center justify-between">
          <button 
            onClick={() => handleNavigate('home')} 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Go to Home"
          >
            <span className="text-2xl pt-1">🐶🐱🐰</span>
            <h1 className="font-display text-2xl font-bold text-gray-700 tracking-tight">Baby<span className="text-pastel-pink">Pets</span></h1>
          </button>
          
          <nav className="flex items-center space-x-6">
            <button 
                onClick={() => handleNavigate('gallery')} 
                className={`text-sm font-bold transition-colors ${currentView === 'gallery' ? 'text-pastel-pink' : 'text-gray-500 hover:text-pastel-pink'}`}
            >
                Gallery
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 w-full flex flex-col ${isUploadMode && currentView === 'home' ? 'overflow-hidden' : ''}`}>
        {renderMainContent()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} currentView={currentView} />
    </div>
  );
}

export default App;