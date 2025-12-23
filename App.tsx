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
import { MagicIcon, CameraIcon, UploadIcon, ShareIcon } from './components/Icons';

const MAX_DAILY_GENERATIONS = 10;
const MAX_UPLOADS = 1;
const CONCURRENCY_LIMIT = 1; 

interface QueueItem {
  id: string;
  styleVariant?: string;
}

type ViewState = 'home' | 'terms' | 'privacy' | 'faq' | 'contact' | 'about' | 'gallery' | 'admin';

const ContentSections = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16 animate-fade-in-up space-y-20 border-t border-brand-100 mt-16">
      {/* How It Works Section */}
      <section id="how-it-works-section" className="space-y-8">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">How It Works - Simple, Fast, and Magical</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-gray-700">1. Upload Your Pet's Photo</h3>
            <p className="text-gray-600 leading-relaxed">Choose a clear, well-lit photo of your pet. The best results come from photos where your pet is facing the camera, with good lighting and their face clearly visible.</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-gray-700">2. AI Transformation Magic</h3>
            <p className="text-gray-600 leading-relaxed">Our advanced AI technology analyzes your pet's features including facial structure, fur patterns, coloring, and unique characteristics, then transforms these into a baby version.</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-gray-700">3. Download and Share</h3>
            <p className="text-gray-600 leading-relaxed">Within seconds, your transformed baby pet photo is ready! Download it in high quality and share it on social media.</p>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section id="tips-section" className="space-y-8">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800">Tips for Best Results</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-2">Choose Clear, Front-Facing Photos</h4>
            <p className="text-gray-600">The AI works best when it can clearly see your pet's face.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-2">Ensure Good Lighting</h4>
            <p className="text-gray-600">Natural daylight or well-lit indoor photos produce the best transformations.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-2">Single Pet Per Photo</h4>
            <p className="text-gray-600">For the most accurate results, upload photos with just one pet.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-2">High-Quality Images Work Best</h4>
            <p className="text-gray-600">Higher resolution photos will generally produce better, more detailed results.</p>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="why-section" className="space-y-8">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 text-center">Why BabyPets.ai?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-4">
            <div className="text-3xl mb-3">📸</div>
            <h4 className="font-bold text-gray-800 mb-2">Instant Nostalgia</h4>
            <p className="text-gray-600 text-sm">See what your pet looked like as a baby</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-3">📱</div>
            <h4 className="font-bold text-gray-800 mb-2">Perfect for Social Media</h4>
            <p className="text-gray-600 text-sm">Baby animal content is universally loved online</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-3">✨</div>
            <h4 className="font-bold text-gray-800 mb-2">Free and Easy to Use</h4>
            <p className="text-gray-600 text-sm">No sign-up required, completely free</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-3">🔒</div>
            <h4 className="font-bold text-gray-800 mb-2">Privacy Focused</h4>
            <p className="text-gray-600 text-sm">Your pet photos are processed securely</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="max-w-3xl mx-auto space-y-8">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-6">
            <h4 className="font-bold text-gray-800 mb-2">Q: What types of pets work best?</h4>
            <p className="text-gray-600">A: BabyPets.ai works with dogs, cats, rabbits, guinea pigs, and most common household pets.</p>
          </div>
          <div className="border-b border-gray-100 pb-6">
            <h4 className="font-bold text-gray-800 mb-2">Q: How long does the transformation take?</h4>
            <p className="text-gray-600">A: Most transformations complete in 10-30 seconds.</p>
          </div>
          <div className="border-b border-gray-100 pb-6">
            <h4 className="font-bold text-gray-800 mb-2">Q: Is my pet photo stored or shared?</h4>
            <p className="text-gray-600">A: We process your images securely and don't permanently store uploaded photos.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Q: Do I need to create an account?</h4>
            <p className="text-gray-600">A: No account needed! BabyPets.ai is completely free and requires no sign-up.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.replace('/', '');
    const validViews: ViewState[] = ['terms', 'privacy', 'faq', 'contact', 'about', 'gallery', 'admin'];
    return (validViews.includes(path as ViewState) ? path : 'home') as ViewState;
  });
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
    const url = view === 'home' ? '/' : `/${view}`;
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      const validViews: ViewState[] = ['terms', 'privacy', 'faq', 'contact', 'about', 'gallery', 'admin'];
      setCurrentView((validViews.includes(path as ViewState) ? path : 'home') as ViewState);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
    if (uploads.length >= MAX_UPLOADS) return;
    const remainingSlots = MAX_UPLOADS - uploads.length;
    const newUploads: UploadedImage[] = files.slice(0, remainingSlots).map(file => ({
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

    return (
      <div className="flex-1 w-full flex flex-col">
         {/* Top Section: Upload Area */}
         <div id="uploader-section" className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center pt-24">
            <h1 className="font-display text-4xl md:text-6xl font-black text-gray-900 mb-4 text-center leading-tight">
               See Your Pet as a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Baby Again</span>
            </h1>
            <p className="text-gray-500 text-center mb-12 max-w-xl font-medium">
               Upload ONE clear photo of your pet and our AI will turn back time to show you their adorable baby version.
            </p>

            {uploads.length < MAX_UPLOADS && (
              <div className="w-full max-w-3xl flex flex-col items-center mb-12">
                <Uploader onFilesSelected={handleFilesSelected} count={uploads.length} disabled={activeRequests > 0} />
                <div className="mt-4 px-6 py-2 bg-white rounded-full shadow-sm border border-brand-100 flex items-center space-x-2">
                   <span className={`w-2 h-2 rounded-full ${remainingGenerations > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                   <p className="text-sm font-bold text-gray-500">
                      {remainingGenerations} free generations remaining today
                   </p>
                </div>
              </div>
            )}

            {uploads.length > 0 && (
              <div className="w-full max-w-5xl animate-fade-in flex flex-col">
                 <div className="flex-1 min-h-0 mb-8 grid grid-cols-1 gap-8">
                   {uploads.map(u => (
                      <ComparisonCard 
                        key={u.id} upload={u} result={results[u.id]} 
                        onRemove={handleRemove} onNameChange={handleNameChange} 
                        onRegenerate={(id) => setQueue(q => [...q, { id }])}
                        isLimitReached={isLimitReached}
                      />
                   ))}
                 </div>
                 <div className="flex flex-col items-center space-y-4 mb-16">
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
            )}
         </div>

         {/* Middle Section: Gallery (Showcase) */}
         <div id="gallery-section" className="bg-white/50 py-12">
            <Showcase />
         </div>

         {/* Bottom Section: Simple, Clean Content Sections */}
         <ContentSections />
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-pastel-cream">
      <header className="bg-white/80 h-20 flex items-center z-50 sticky top-0 border-b border-brand-100 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 flex-1 flex items-center justify-between">
          <button onClick={() => handleNavigate('home')} className="font-display text-2xl font-bold flex items-center">
            Baby<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Pets</span>.ai 🐱🐶✨
          </button>
          <nav className="flex items-center space-x-6">
            <button 
              onClick={() => handleNavigate('gallery')} 
              className={`font-display font-bold transition-colors ${currentView === 'gallery' ? 'text-pastel-pink' : 'text-gray-700 hover:text-pastel-pink'}`}
            >
              Gallery
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{renderMainContent()}</main>
      <Footer onNavigate={handleNavigate} currentView={currentView} />
    </div>
  );
}

export default App;