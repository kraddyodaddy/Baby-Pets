import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Uploader } from './components/Uploader';
import { ComparisonCard } from './components/ComparisonCard';
import { generateBabyPet } from './services/geminiService';
import type { UploadedImage, TransformationResult } from './types';
import { MagicIcon } from './components/Icons';

const MAX_DAILY_GENERATIONS = 2;
const CONCURRENCY_LIMIT = 1; // Process items one by one to simulate high demand queue

interface QueueItem {
  id: string;
  styleVariant?: string;
}

function App() {
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
  }, []);

  const isLimitReached = usageCount >= MAX_DAILY_GENERATIONS;

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

  return (
    <div className={`flex flex-col font-sans text-gray-800 bg-[#fafaf9] ${isUploadMode ? 'h-[100dvh]' : 'min-h-screen'}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0 h-16 flex items-center z-50">
        <div className="max-w-5xl mx-auto px-4 flex-1 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl pt-1">🐶🐱</span>
            <h1 className="font-display text-2xl font-bold text-gray-900 tracking-tight">Baby<span className="text-brand-500">Pets</span></h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Powered by Gemini AI
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 w-full max-w-5xl mx-auto px-4 flex flex-col ${isUploadMode ? 'overflow-hidden' : 'py-8 overflow-y-auto'}`}>
        
        {/* IDLE MODE: Intro & Uploader */}
        {!isUploadMode ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-fade-in min-h-[500px]">
             {/* Intro Section */}
            <section className="text-center max-w-2xl mx-auto px-2">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                See your pet as a <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
                  tiny baby again
                </span>
              </h2>
              <p className="text-lg text-gray-600 font-light">
                Upload a photo, tell us its name, and see it reimagined as an adorable baby.
              </p>
              <p className="text-md text-gray-500 mt-2 font-medium">
                (Works best with clear photos of a single pet.)
              </p>
              <div className="mt-2 text-xs text-gray-400">
                Daily Usage: {usageCount} / {MAX_DAILY_GENERATIONS}
              </div>
            </section>

            {/* Upload Section */}
            <section className="max-w-xl mx-auto w-full px-2">
              <Uploader 
                onFilesSelected={handleFilesSelected} 
                count={uploads.length} 
                disabled={isProcessing}
              />
            </section>

             {/* Placeholder Art for empty state visuals */}
             <div className="flex space-x-6 opacity-30 select-none">
                <div className="w-24 h-24 bg-gray-200 rounded-2xl rotate-[-6deg]"></div>
                <div className="w-24 h-24 bg-gray-200 rounded-2xl rotate-[6deg] -mt-4"></div>
             </div>
          </div>
        ) : (
          /* UPLOAD MODE: Workspace */
          <div className="flex-1 flex flex-col items-center h-full w-full py-2 md:py-4 animate-fade-in">
             
             {/* Card Container: Allow scroll on mobile via overflow-y-auto */}
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
                    className="h-auto md:h-full shadow-lg border border-gray-200 shrink-0 mb-20 md:mb-0" // mb-20 provides space for bottom bar on mobile scroll
                  />
               ))}
             </div>

             {/* Action Bar: Fixed at bottom */}
             <div className="shrink-0 flex flex-col items-center justify-center w-full mt-2 md:mt-4 pb-2 z-20 px-4 md:px-0 bg-[#fafaf9] md:bg-transparent">
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
                          : 'bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:brightness-110'
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
                            <span>Transform into Baby</span>
                          </>
                      )}
                    </button>
                    {!allNamesFilled && (
                        <p className="text-red-500 text-sm mt-2 font-medium animate-pulse bg-red-50 px-3 py-1 rounded-full text-center">
                            Please name your pet to continue
                        </p>
                    )}
                  </>
                )}

                {hasSuccess && !isProcessing && (
                  <button
                    onClick={() => handleStartOver()}
                    className="mt-3 flex items-center justify-center space-x-2 px-6 py-3 md:py-2 bg-white text-gray-500 border border-gray-200 rounded-full hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm font-medium text-sm w-full md:w-auto"
                  >
                    <span>See another pet baby</span>
                  </button>
                )}
             </div>
          </div>
        )}

      </main>

      {/* Footer (Only in Idle Mode) */}
      {!isUploadMode && (
        <footer className="bg-white border-t border-gray-100 py-6 shrink-0">
          <div className="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} BabyPets. Made with Gemini 2.5.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;