
import React, { useState, useEffect } from 'react';
import { UploadedImage, TransformationResult } from '../types';
import { 
  XMarkIcon, MagicIcon, DownloadIcon, ClockIcon, ShareIcon, CameraIcon,
  FacebookIcon, InstagramIcon, TwitterIcon, TikTokIcon, RedditIcon 
} from './Icons';
import { validatePetImage, fileToBase64 } from '../services/geminiService';
import { addToGallery } from '../services/galleryService';
import { compressImage } from '../services/imageService';
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';

interface ComparisonCardProps {
  upload: UploadedImage;
  result?: TransformationResult;
  onRemove: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
  onRegenerate: (id: string, styleVariant?: string) => void;
  isLimitReached: boolean;
  className?: string;
}

const LOADING_MESSAGES = [
  { text: 'Creating something magical...', icon: '✨' },
  { text: 'Turning back time...', icon: '🕰️' },
  { text: 'Almost ready...', icon: '☁️' },
  { text: 'Making memories...', icon: '💝' },
  { text: 'Bringing out the baby...', icon: '🐾' },
  { text: 'Just a moment...', icon: '⭐' },
  { text: 'Adding sweetness...', icon: '🍭' },
  { text: 'Transforming with care...', icon: '🎨' },
  { text: 'Nearly there...', icon: '🎀' },
  { text: 'Sprinkling magic...', icon: '🪄' },
];

const ANIMATIONS = ['animate-soft-slide-up', 'animate-gentle-blur', 'animate-dreamy-fade'];

// Helper to generate comparison image for download
const createComparisonImage = (originalUrl: string, generatedUrl: string, petName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img1 = new Image();
    const img2 = new Image();
    img1.crossOrigin = "anonymous";
    img2.crossOrigin = "anonymous";
    let loaded = 0;
    const onLoaded = () => { loaded++; if (loaded === 2) render(); };
    img1.onload = onLoaded; img2.onload = onLoaded;
    img1.onerror = (e) => reject(e); img2.onerror = (e) => reject(e);
    img1.src = originalUrl; img2.src = generatedUrl;

    function render() {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("No canvas context");
        const padding = 40; const gap = 20; const headerHeight = 80; const workHeight = 1080; 
        const scale1 = workHeight / img1.height; const scale2 = workHeight / img2.height;
        const w1 = img1.width * scale1; const w2 = img2.width * scale2;
        canvas.width = padding + w1 + gap + w2 + padding;
        canvas.height = padding + headerHeight + workHeight + 120 + padding;
        ctx.fillStyle = '#FFFEF7'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 50px Quicksand, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(`Baby ${petName}`, canvas.width / 2, padding + 50);
        ctx.drawImage(img1, padding, padding + headerHeight, w1, workHeight);
        ctx.drawImage(img2, padding + w1 + gap, padding + headerHeight, w2, workHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (err) { reject(err); }
    }
  });
};

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  upload, result, onRemove, onNameChange, onRegenerate, isLimitReached, className = ""
}) => {
  const isQueued = result?.status === 'queued';
  const isLoading = result?.status === 'loading';
  const isSuccess = result?.status === 'success';
  const isError = result?.status === 'error';

  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState(ANIMATIONS[0]);
  const [isSharing, setIsSharing] = useState(false);
  const [isGeneratingComparison, setIsGeneratingComparison] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [galleryCheck, setGalleryCheck] = useState(false);
  const [isSubmittingToGallery, setIsSubmittingToGallery] = useState(false);
  const [galleryStatus, setGalleryStatus] = useState<'idle' | 'success' | 'error' | 'rejected'>('idle');
  const [galleryErrorMessage, setGalleryErrorMessage] = useState('');
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (isSuccess && !hasRevealed) {
        setHasRevealed(true);
        setTimeout(() => {
            confetti({ origin: { y: 0.7 }, particleCount: 150, spread: 70 });
        }, 100);
    }
  }, [isSuccess]);

  useEffect(() => {
    let progressInterval: any;
    let messageInterval: any;
    if (isLoading) {
      setProgress(5);
      progressInterval = setInterval(() => setProgress(p => p >= 95 ? 95 : p + (95 - p) * 0.05), 400);
      messageInterval = setInterval(() => {
        setCurrentMessageIndex(Math.floor(Math.random() * LOADING_MESSAGES.length));
        setCurrentAnimation(ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)]);
      }, 2500);
    }
    return () => { clearInterval(progressInterval); clearInterval(messageInterval); };
  }, [isLoading]);

  const handleDownloadClick = async (e: any) => {
    e.preventDefault();
    if (!result?.generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = result.generatedImageUrl;
    link.download = `baby-${upload.petName || 'pet'}.png`;
    link.click();
  };

  const handleDownloadComparison = async () => {
    if (!result?.generatedImageUrl || isGeneratingComparison) return;
    setIsGeneratingComparison(true);
    try {
      const dataUrl = await createComparisonImage(upload.previewUrl, result.generatedImageUrl, upload.petName || 'Pet');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `comparison-${upload.petName || 'pet'}.jpg`;
      link.click();
    } finally { setIsGeneratingComparison(false); }
  };

  const handleAddToGallery = async () => {
    if (!result?.generatedImageUrl || isSubmittingToGallery || galleryStatus === 'success') return;
    setIsSubmittingToGallery(true);
    setGalleryStatus('idle');
    try {
      const isSafe = await validatePetImage(upload.file);
      if (!isSafe) {
        setGalleryStatus('rejected');
        setGalleryErrorMessage("Image not suitable for gallery.");
        return;
      }

      // Prepare & Compress images for public storage
      const originalBase64 = await fileToBase64(upload.file);
      const base64Prefix = upload.file.type === 'image/png' ? 'data:image/png;base64,' : 'data:image/jpeg;base64,';
      const originalDataUrl = `${base64Prefix}${originalBase64}`;

      // COMPRESSION STEP
      const compressedOriginal = await compressImage(originalDataUrl, 1024, 0.7);
      const compressedBaby = await compressImage(result.generatedImageUrl, 1024, 0.7);

      await addToGallery({
        petName: upload.petName || 'Baby Pet',
        originalImage: compressedOriginal,
        babyImage: compressedBaby,
        timestamp: Date.now()
      });
      setGalleryStatus('success');
    } catch (e: any) {
      setGalleryStatus('error');
      setGalleryErrorMessage(e.message || "Failed to save.");
    } finally {
      setIsSubmittingToGallery(false);
    }
  };

  const renderResultState = () => {
    if (!result || result.status === 'idle') return <div className="text-center p-4"><MagicIcon className="w-16 h-16 text-pastel-pink mx-auto mb-2" /><p className="text-pastel-purple font-bold">Ready</p></div>;
    if (isQueued) return <div className="text-center p-4"><ClockIcon className="w-16 h-16 text-pastel-yellow mx-auto mb-2 animate-pulse" /><p className="text-yellow-600 font-bold">In Queue</p></div>;
    if (isLoading) return <div className="flex flex-col items-center justify-center p-6 text-center w-full h-full"><div className="text-6xl mb-6 animate-float-gentle">{LOADING_MESSAGES[currentMessageIndex].icon}</div><h3 className={`text-2xl font-display font-bold text-brand-600 mb-8 ${currentAnimation}`}>{LOADING_MESSAGES[currentMessageIndex].text}</h3><div className="w-48 bg-gray-100 rounded-full h-3 overflow-hidden"><div className="bg-brand-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div></div></div>;
    if (isError) return <div className="text-center p-4 text-red-500"><XMarkIcon className="w-12 h-12 mx-auto mb-2" /><p className="font-bold">Error</p><p className="text-xs">{result.error}</p></div>;
    if (isSuccess && result.generatedImageUrl) return <img src={result.generatedImageUrl} alt="Baby Pet" className="w-full h-full object-contain animate-pop-in" />;
    return null;
  };

  return (
    <div className={`bg-white rounded-3xl shadow-lg border border-brand-100 overflow-hidden relative flex flex-col md:flex-row ${className}`}>
      {/* Mobile + Desktop unified layout simplified for focus on Gallery limits */}
      <div className="flex flex-col md:flex-row w-full min-h-[400px]">
        <div className="flex-1 bg-gray-50 relative flex items-center justify-center border-r border-gray-100">
           <img src={upload.previewUrl} alt="Original" className="w-full h-full object-contain" />
           <div className="absolute bottom-4 left-4 bg-black/40 text-white text-xs px-2 py-1 rounded">Original</div>
        </div>
        <div className="flex-1 bg-brand-50 relative flex flex-col items-center justify-center">
            {renderResultState()}
            {isSuccess && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 border-t border-brand-100 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center space-x-2">
                   {galleryStatus === 'success' ? (
                     <span className="text-green-600 text-xs font-bold">✅ Posted!</span>
                   ) : (
                     <button 
                       onClick={handleAddToGallery} 
                       disabled={isSubmittingToGallery}
                       className="text-xs bg-brand-500 text-white px-3 py-1.5 rounded-full font-bold shadow-sm hover:scale-105 transition-transform"
                     >
                        {isSubmittingToGallery ? 'Posting...' : 'Post to Gallery'}
                     </button>
                   )}
                   {galleryStatus === 'rejected' && <span className="text-red-500 text-[10px]">Invalid Image</span>}
                   {galleryStatus === 'error' && <span className="text-red-500 text-[10px]">{galleryErrorMessage}</span>}
                </div>
                <div className="flex space-x-2">
                   <button onClick={handleDownloadClick} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-brand-100"><DownloadIcon className="w-4 h-4" /></button>
                   <button onClick={handleDownloadComparison} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-brand-100"><CameraIcon className="w-4 h-4" /></button>
                </div>
              </div>
            )}
        </div>
      </div>
      
      {!isSuccess && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <input 
            type="text" 
            value={upload.petName} 
            onChange={(e) => onNameChange(upload.id, e.target.value)}
            placeholder="Pet's Name" 
            className="w-full px-4 py-2 rounded-xl border-2 border-brand-200 focus:border-brand-500 outline-none"
          />
        </div>
      )}

      <button onClick={() => onRemove(upload.id)} className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-gray-100">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
