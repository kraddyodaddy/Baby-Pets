import React, { useState, useEffect } from 'react';
import { UploadedImage, TransformationResult } from '../types';
import { 
  XMarkIcon, MagicIcon, DownloadIcon, ClockIcon, ShareIcon,
  FacebookIcon, InstagramIcon, TwitterIcon, TikTokIcon, RedditIcon 
} from './Icons';
import { validatePetImage, fileToBase64 } from '../services/geminiService';
import { addToGallery } from '../services/galleryService';
import { v4 as uuidv4 } from 'uuid';

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
  'Baby pets incoming soon...',
  'Get ready to see your angel as a baby pet...',
  'Preparing extra cute fluff...',
  'Almost there, do the cute pet voice...',
  'Turning your best friend into a baby pet...',
  'Squeal level cuteness loading...',
  'Sprinkling baby magic... ✨',
  'Turning back the clock to puppy/kitten days...',
  'Shrinking those paws...',
  'Adding extra adorableness...',
  'Rewinding to maximum cuteness...',
  'Baby-fying in progress...',
  'Unleashing the tiny version...',
  'Making those eyes even bigger...',
  'Fluffing up the baby fur...',
  'Your fur baby is getting even baby-er...',
  'Activating cuteness overload...',
  'Time traveling to babyhood...',
  'Preparing your heart for maximum awww...',
  'Warning: cuteness levels rising...',
  'Summoning the baby version...',
  'Almost ready to melt your heart...',
  'One second... finding their baby photos...',
  'Teaching them how to be tiny again...',
  'Dialing up the adorable...',
  'Your baby pet is on the way!',
  '🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮'
];

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  upload, 
  result, 
  onRemove, 
  onNameChange,
  onRegenerate,
  isLimitReached,
  className = ""
}) => {
  const isQueued = result?.status === 'queued';
  const isLoading = result?.status === 'loading';
  const isSuccess = result?.status === 'success';
  const isError = result?.status === 'error';

  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(LOADING_MESSAGES[0]);
  const [isSharing, setIsSharing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Gallery State
  const [galleryCheck, setGalleryCheck] = useState(false);
  const [isSubmittingToGallery, setIsSubmittingToGallery] = useState(false);
  const [galleryStatus, setGalleryStatus] = useState<'idle' | 'success' | 'error' | 'rejected'>('idle');
  const [galleryErrorMessage, setGalleryErrorMessage] = useState('');

  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval> | undefined;
    let messageInterval: ReturnType<typeof setInterval> | undefined;

    if (isLoading) {
      setProgress(5); // Start with a little progress
      
      // Pick a random start message
      setCurrentMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);

      // Progress bar simulation: approach 95% over time
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return 95;
          const remaining = 95 - prev;
          // Move roughly 5% of the remaining distance per tick to simulate deceleration
          return prev + (remaining * 0.05);
        });
      }, 400);

      // Cycle messages randomly every 2.5 seconds
      messageInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
        setCurrentMessage(LOADING_MESSAGES[randomIndex]);
      }, 2500);

    } else {
      setProgress(0);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  const handleShare = async (platformName: string) => {
    if (!result?.generatedImageUrl || isSharing) return;

    setIsSharing(true);
    try {
      // 1. Convert base64/url to Blob/File for sharing
      const response = await fetch(result.generatedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], `baby-${upload.petName || 'pet'}.png`, { type: 'image/png' });

      const shareData = {
        title: 'BabyPets',
        text: 'Meet my baby pet! Created by BabyPets.ai',
        files: [file],
      };

      // 2. Try native share
      let canNativeShare = false;
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        canNativeShare = true;
      }

      if (canNativeShare) {
        await navigator.share(shareData);
      } else {
        throw new Error('Native file share not supported');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setIsSharing(false);
        return;
      }

      const imageWindow = window.open("", "_blank");
      if (imageWindow) {
        imageWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Baby ${upload.petName || 'Pet'}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background-color:#FFFEF7; min-height:100vh; font-family: sans-serif; text-align:center; padding: 20px;">
              <img src="${result.generatedImageUrl}" style="max-width:100%; max-height:80vh; object-fit:contain; border-radius:12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" alt="Generated Baby Pet" />
              <div style="margin-top: 24px; color: #4A4A4A; background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); max-width: 400px;">
                <h3 style="margin: 0 0 8px 0; color: #FFB6D9;">Share to ${platformName}</h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                  Tap and hold (or right-click) the image above to <strong>Save</strong> it to your device.<br/><br/>
                  Then open <strong>${platformName}</strong> and upload your new baby pet photo!
                </p>
              </div>
            </body>
          </html>
        `);
        imageWindow.document.close();
      } else {
        alert("Pop-up blocked. Please allow pop-ups to share this image.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareWithFriend = async () => {
    if (!result?.generatedImageUrl || isSharing) return;

    setIsSharing(true);
    
    // Data to share
    const shareUrl = "https://babypets.ai";
    const shareText = "Look what I made at BabyPets.ai! 🐾";
    const title = `Baby ${upload.petName || 'Pet'}`;

    try {
        // Try to fetch image
        const response = await fetch(result.generatedImageUrl);
        const blob = await response.blob();
        const file = new File([blob], `baby-${upload.petName || 'pet'}.png`, { type: 'image/png' });
        
        const shareData = {
            title: title,
            text: `${shareText} ${shareUrl}`,
            files: [file],
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
        } else {
             // Try text only share if file share not supported
             const textShareData = {
                title: title,
                text: `${shareText} ${shareUrl}`,
                url: shareUrl
             };
             if (navigator.canShare && navigator.canShare(textShareData)) {
                 await navigator.share(textShareData);
             } else {
                 throw new Error("Web Share API not supported");
             }
        }
    } catch (error: any) {
        if (error.name !== 'AbortError') {
             // Fallback to clipboard
             try {
                await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                setCopyFeedback(true);
                setTimeout(() => setCopyFeedback(false), 2000);
             } catch (err) {
                 console.error("Clipboard copy failed");
             }
        }
    } finally {
        setIsSharing(false);
    }
  };

  const handleDownloadClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // On mobile, try to use native share (Save Image) flow
    if (isMobile && navigator.share && result?.generatedImageUrl) {
      e.preventDefault();
      
      if (isSharing) return;
      setIsSharing(true);

      try {
        const response = await fetch(result.generatedImageUrl);
        const blob = await response.blob();
        const file = new File([blob], `baby-${upload.petName || 'pet'}.png`, { type: 'image/png' });
        
        const shareData = {
          files: [file],
          title: 'Baby Pet Photo'
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          // Fallback to traditional download if sharing files isn't supported
          const link = document.createElement('a');
          link.href = result.generatedImageUrl;
          link.download = `baby-${upload.petName || 'pet'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error: any) {
        // If it wasn't a user cancellation, try fallback
        if (error.name !== 'AbortError') {
           const link = document.createElement('a');
           link.href = result.generatedImageUrl;
           link.download = `baby-${upload.petName || 'pet'}.png`;
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
        }
      } finally {
        setIsSharing(false);
      }
    }
  };

  const handleAddToGallery = async () => {
    if (!result?.generatedImageUrl || isSubmittingToGallery || galleryStatus === 'success') return;

    setIsSubmittingToGallery(true);
    setGalleryStatus('idle');
    setGalleryErrorMessage('');

    try {
      // 1. AI Safety Check
      const isSafe = await validatePetImage(upload.file);
      
      if (!isSafe) {
        setGalleryStatus('rejected');
        setGalleryErrorMessage("Sorry, this image doesn't meet our gallery guidelines (must be a clear, appropriate pet photo).");
        setIsSubmittingToGallery(false);
        return;
      }

      // 2. Prepare Data
      const originalBase64 = await fileToBase64(upload.file);
      const base64Prefix = upload.file.type === 'image/png' ? 'data:image/png;base64,' : 'data:image/jpeg;base64,';
      
      addToGallery({
        id: uuidv4(),
        petName: upload.petName || 'Baby Pet',
        originalImage: `${base64Prefix}${originalBase64}`,
        babyImage: result.generatedImageUrl,
        timestamp: Date.now()
      });

      setGalleryStatus('success');
    } catch (e) {
      console.error(e);
      setGalleryStatus('error');
      setGalleryErrorMessage("Something went wrong while saving to the gallery.");
    } finally {
      setIsSubmittingToGallery(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------

  const renderResultState = () => {
    if (!result || result.status === 'idle') {
      return (
        <div className="text-center p-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm text-pastel-pink">
            <MagicIcon className="w-6 h-6" />
          </div>
          <p className="text-pastel-purple/80 font-medium text-xs leading-tight">Ready to<br/>transform</p>
        </div>
      );
    }
    if (isQueued) {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center w-full animate-pulse">
          <div className="w-10 h-10 bg-pastel-yellow rounded-full flex items-center justify-center mb-2 shadow-sm text-yellow-600">
            <ClockIcon className="w-6 h-6" />
          </div>
          <h3 className="text-yellow-700 font-bold text-sm mb-1">Queueing</h3>
          <p className="text-yellow-600 font-medium text-[10px] leading-tight">Waiting for slot...</p>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center w-full max-w-[90%]">
          <div className="w-full bg-white rounded-full h-2 mb-3 overflow-hidden shadow-inner border border-brand-100">
            <div 
              className="bg-gradient-to-r from-pastel-blue via-pastel-purple to-pastel-pink h-full rounded-full transition-all duration-300 ease-out relative" 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
            </div>
          </div>
          <p className="text-pastel-pink font-display font-medium text-xs animate-pulse leading-tight">
            {currentMessage}
          </p>
        </div>
      );
    }
    if (isError) {
      return (
        <div className="text-center p-4 text-red-400 flex flex-col items-center justify-center h-full w-full">
          <div className="bg-red-50 p-2 rounded-full mb-1">
            <XMarkIcon className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-bold mb-1 text-gray-700">Failed</p>
          <p className="text-[10px] text-gray-500 leading-tight max-w-xs">{result.error || "Error"}</p>
        </div>
      );
    }
    if (isSuccess && result.generatedImageUrl) {
      return (
        <img 
          src={result.generatedImageUrl} 
          alt="Baby Pet Version" 
          className="w-full h-full object-contain animate-fade-in absolute inset-0 md:static"
        />
      );
    }
    return null;
  };

  const renderNameInput = () => (
    <div className="w-full animate-fade-in-up">
      <label className="block text-sm font-bold text-gray-600 mb-2">
        What's your pet's name? <span className="text-pastel-pink">*</span>
      </label>
      <input 
        type="text" 
        value={upload.petName}
        onChange={(e) => onNameChange(upload.id, e.target.value)}
        placeholder="Enter name (e.g. Fluffy)"
        required
        autoFocus={!upload.petName} // Auto focus if name is empty
        className="w-full text-lg px-4 py-3 rounded-2xl border-2 border-brand-100 focus:border-pastel-pink focus:ring-4 focus:ring-brand-50 outline-none transition-all placeholder:text-gray-300 bg-white shadow-sm"
        disabled={isLoading || isSuccess || isQueued} 
      />
    </div>
  );

  const renderRegenerateButtons = () => {
    if (!isSuccess || isLimitReached) return null;
    return (
      <div className="flex flex-row space-x-2 w-full">
        <button 
          onClick={() => onRegenerate(upload.id)}
          className="flex-1 bg-white hover:bg-pastel-pink-light text-gray-600 hover:text-gray-800 border border-brand-100 py-3 md:py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          Again
        </button>
        <button 
          onClick={() => onRegenerate(upload.id, "Use a softer, dreamier, alternate artistic style.")}
          className="flex-1 bg-white hover:bg-pastel-pink-light text-gray-600 hover:text-gray-800 border border-brand-100 py-3 md:py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          New Style
        </button>
      </div>
    );
  };

  const renderGallerySection = () => {
    if (!isSuccess) return null;

    if (galleryStatus === 'success') {
      return (
        <div className="w-full bg-pastel-mint/30 border border-pastel-mint text-green-700 p-3 rounded-xl text-sm font-medium text-center">
          ✨ Successfully added to the Gallery!
        </div>
      );
    }

    if (galleryStatus === 'rejected') {
       return (
        <div className="w-full bg-red-50 border border-red-200 text-red-500 p-3 rounded-xl text-xs text-center">
          {galleryErrorMessage}
        </div>
       );
    }
    
    if (galleryStatus === 'error') {
       return (
        <div className="w-full bg-red-50 border border-red-200 text-red-500 p-3 rounded-xl text-xs text-center">
          {galleryErrorMessage}
        </div>
       );
    }

    return (
      <div className="w-full bg-pastel-cream border border-brand-100 rounded-xl p-3 flex flex-col space-y-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={galleryCheck} 
            onChange={(e) => setGalleryCheck(e.target.checked)}
            className="w-4 h-4 text-pastel-pink rounded focus:ring-pastel-pink border-gray-300"
          />
          <span className="text-sm text-gray-600 font-medium select-none">Share my transformation to the public gallery</span>
        </label>
        
        {galleryCheck && (
          <button 
            onClick={handleAddToGallery}
            disabled={isSubmittingToGallery}
            className={`
              w-full py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center justify-center
              ${isSubmittingToGallery 
                ? 'bg-gray-100 text-gray-400 cursor-wait' 
                : 'bg-white border-2 border-pastel-pink text-pastel-pink hover:bg-pastel-pink hover:text-white'
              }
            `}
          >
             {isSubmittingToGallery ? (
               <>Processing AI Check...</>
             ) : (
               <>Submit to Gallery</>
             )}
          </button>
        )}
      </div>
    );
  };

  const renderShareBar = () => {
    if (!isSuccess) return null;
    return (
      <div className="bg-white rounded-xl p-3 flex items-center justify-between border border-brand-50 w-full shadow-sm">
        <span className="text-[10px] font-bold text-gray-400 px-1 uppercase tracking-wide hidden xs:block">Share:</span>
        <div className="flex space-x-2 justify-between w-full xs:w-auto">
          <button onClick={() => handleShare('Facebook')} disabled={isSharing} className="p-2 text-blue-500 bg-white hover:bg-blue-50 border border-gray-100 rounded-lg transition-colors shadow-sm"><FacebookIcon className="w-5 h-5" /></button>
          <button onClick={() => handleShare('Instagram')} disabled={isSharing} className="p-2 text-pink-500 bg-white hover:bg-pink-50 border border-gray-100 rounded-lg transition-colors shadow-sm"><InstagramIcon className="w-5 h-5" /></button>
          <button onClick={() => handleShare('Twitter')} disabled={isSharing} className="p-2 text-gray-600 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm"><TwitterIcon className="w-5 h-5" /></button>
          <button onClick={() => handleShare('TikTok')} disabled={isSharing} className="p-2 text-black bg-white hover:bg-gray-50 border border-gray-100 rounded-lg transition-colors shadow-sm"><TikTokIcon className="w-5 h-5" /></button>
          <button onClick={() => handleShare('Reddit')} disabled={isSharing} className="p-2 text-orange-500 bg-white hover:bg-orange-50 border border-gray-100 rounded-lg transition-colors shadow-sm"><RedditIcon className="w-5 h-5" /></button>
        </div>
      </div>
    );
  };
  
  const renderShareWithFriendButton = () => {
     if (!isSuccess) return null;
     
     return (
        <button
          onClick={handleShareWithFriend}
          disabled={isSharing}
          className={`
            w-full py-3.5 rounded-xl font-bold text-base shadow-md transition-all flex items-center justify-center
            bg-gradient-to-r from-pastel-blue to-pastel-purple hover:brightness-105 text-white
            active:transform active:scale-95
          `}
        >
           {copyFeedback ? (
               <span>Link Copied! ✅</span>
           ) : (
               <>
                 <ShareIcon className="w-5 h-5 mr-2" />
                 Share with Friend
               </>
           )}
        </button>
     );
  };

  const renderDownloadButton = () => {
    if (!isSuccess || !result?.generatedImageUrl) return null;
    
    // Check if device is likely mobile to show "Save Image" vs "Download Image"
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
      <a 
        href={result.generatedImageUrl} 
        download={`baby-${upload.petName || 'pet'}.png`}
        onClick={handleDownloadClick}
        className="bg-pastel-pink hover:bg-brand-600 text-white py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center font-bold text-base w-full active:transform active:scale-95 cursor-pointer"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        {isMobile ? 'Save Image' : 'Download Image'}
      </a>
    );
  };

  return (
    <div className={`bg-white rounded-3xl shadow-lg border border-brand-100 overflow-hidden relative flex flex-col md:flex-row ${className}`}>
      
      {/* Remove Button (Absolute) */}
      <button 
        onClick={() => onRemove(upload.id)}
        className="absolute top-2 right-2 z-40 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-400 p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors border border-gray-100"
        aria-label="Remove"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>

      {/* =================================================================================
          MOBILE LAYOUT (< md) 
          Structure: 
          1. Images Row (Side-by-side, fully visible)
          2. Controls Column (Flow below images)
         ================================================================================= */}
      <div className="flex flex-col w-full md:hidden">
        {/* 1. Side-by-Side Images - Height optimized for small screens (iPhone SE) */}
        {/* Changed from fixed h-52/h-64/h-80 to aspect ratio 2:1 so each side is a square, reducing tall borders on wide screens */}
        <div className="flex flex-row w-full aspect-[2/1] border-b border-gray-100">
           {/* Left: Original */}
           <div className="w-1/2 relative border-r border-gray-100 bg-gray-50 flex items-center justify-center">
             <img src={upload.previewUrl} alt="Original" className="w-full h-full object-contain" />
             <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">Original</div>
           </div>
           
           {/* Right: Result */}
           <div className="w-1/2 relative bg-pastel-pink-superlight flex flex-col items-center justify-center">
             {renderResultState()}
             {isSuccess && <div className="absolute bottom-2 right-2 bg-pastel-pink/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">Baby Pet</div>}
           </div>
        </div>

        {/* 2. Controls Flow (Below images) */}
        <div className="p-4 bg-white">
           {/* Pet Name or Input */}
           {!isSuccess ? renderNameInput() : (
             <div className="text-center pb-2 border-b border-gray-50 mb-3">
               <h3 className="font-display font-bold text-2xl text-gray-800">Baby {upload.petName}</h3>
             </div>
           )}
           
           {isSuccess && (
             <div className="flex flex-col space-y-3 animate-fade-in">
               
               {/* Daily Limit Message if applicable */}
               {isLimitReached && (
                 <div className="bg-gray-100 text-gray-500 text-xs font-medium py-2 px-3 rounded-lg text-center">
                   Daily limit reached. Come back tomorrow!
                 </div>
               )}

               {/* b) Again / New Style */}
               {!isLimitReached && renderRegenerateButtons()}
               
               {/* c) Social Share */}
               {renderShareBar()}
               
               {/* d) Share with Friend */}
               {renderShareWithFriendButton()}

               {/* e) Download Button */}
               {renderDownloadButton()}

               {/* f) Gallery Submission */}
               {renderGallerySection()}
             </div>
           )}
        </div>
      </div>


      {/* =================================================================================
          DESKTOP LAYOUT (>= md) 
          Structure: Split View with Overlays
         ================================================================================= */}
      <div className="hidden md:flex md:flex-row w-full h-full min-h-[400px]">
        {/* Left Side: Original + Input */}
        <div className="flex flex-col flex-1 border-r border-brand-100 relative w-1/2">
           <div className="relative flex-1 bg-gray-50 overflow-hidden flex items-center justify-center">
             <img src={upload.previewUrl} alt="Original" className="w-full h-full object-contain" />
             <div className="absolute bottom-4 left-4 bg-black/40 text-white text-xs px-2 py-1 rounded-md backdrop-blur-md">Original</div>
           </div>
           <div className="shrink-0 p-4 bg-white border-t border-brand-100 z-10">
             {/* Hide input on desktop too if success, replace with name */}
             {!isSuccess ? renderNameInput() : (
                <div className="text-center py-2">
                   <h3 className="font-display font-bold text-xl text-gray-700">Baby {upload.petName}</h3>
                </div>
             )}
           </div>
        </div>

        {/* Right Side: Result + Controls */}
        <div className="flex flex-col flex-1 w-1/2 bg-pastel-pink-superlight">
           
           {/* Image Area (Flex Grow) */}
           <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
               {renderResultState()}
               
               {/* Top Regenerate Buttons Overlay */}
               {isSuccess && !isLimitReached && (
                  <div className="absolute top-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                     <button 
                       onClick={() => onRegenerate(upload.id)}
                       className="bg-white/90 hover:bg-white text-xs font-medium text-pastel-pink px-4 py-2 rounded-full shadow-md backdrop-blur-sm transform hover:scale-105 transition-all"
                     >
                       Again
                     </button>
                     <button 
                       onClick={() => onRegenerate(upload.id, "Use a softer, dreamier, alternate artistic style.")}
                       className="bg-white/90 hover:bg-white text-xs font-medium text-pastel-pink px-4 py-2 rounded-full shadow-md backdrop-blur-sm transform hover:scale-105 transition-all"
                     >
                       New Style
                     </button>
                  </div>
               )}
           </div>

           {/* Bottom Controls Area (Static) */}
           {isSuccess && (
             <div className="shrink-0 p-4 bg-white border-t border-brand-100 z-10 flex flex-col space-y-3">
                 {/* Top Row: Share Icons + Gallery Checkbox */}
                 <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                      {/* Share Icons Section */}
                      <div className="flex items-center justify-between xl:justify-start w-full xl:w-auto xl:space-x-3">
                        <span className="text-[10px] font-bold text-gray-400 px-1 uppercase tracking-wide shrink-0">Share:</span>
                        <div className="flex space-x-1">
                          <button onClick={() => handleShare('Facebook')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FacebookIcon className="w-5 h-5" /></button>
                          <button onClick={() => handleShare('Instagram')} className="p-1.5 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"><InstagramIcon className="w-5 h-5" /></button>
                          <button onClick={() => handleShare('Twitter')} className="p-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"><TwitterIcon className="w-5 h-5" /></button>
                          <button onClick={() => handleShare('TikTok')} className="p-1.5 text-black hover:bg-gray-100 rounded-lg transition-colors"><TikTokIcon className="w-5 h-5" /></button>
                        </div>
                      </div>

                      {/* Gallery Checkbox Section */}
                      {galleryStatus !== 'success' && (
                        <div className="xl:pl-4 xl:border-l xl:border-gray-200 w-full xl:w-auto flex justify-center xl:justify-end">
                            {galleryStatus === 'error' || galleryStatus === 'rejected' ? (
                                <p className="text-[10px] text-red-500 text-center">{galleryErrorMessage}</p>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={galleryCheck} 
                                            onChange={(e) => setGalleryCheck(e.target.checked)}
                                            className="w-3.5 h-3.5 text-pastel-pink rounded focus:ring-pastel-pink border-gray-300"
                                        />
                                        <span className="text-xs text-gray-600 font-medium">Add to Gallery</span>
                                    </label>
                                    {galleryCheck && (
                                        <button 
                                            onClick={handleAddToGallery}
                                            disabled={isSubmittingToGallery}
                                            className="text-xs bg-pastel-pink text-white px-3 py-1 rounded-full hover:bg-brand-600 shadow-sm"
                                        >
                                            {isSubmittingToGallery ? '...' : 'Post'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                      )}
                      
                      {galleryStatus === 'success' && (
                          <div className="xl:pl-4 xl:border-l xl:border-gray-200 text-center text-xs text-green-600 font-bold py-1">Shared to Gallery!</div>
                      )}
                 </div>

                 {/* Bottom Row: Buttons Side by Side */}
                 <div className="flex flex-row space-x-3">
                    <div className="flex-1">
                        {renderShareWithFriendButton()}
                    </div>
                    <div className="flex-1">
                        {renderDownloadButton()}
                    </div>
                 </div>
             </div>
           )}
        </div>
      </div>

    </div>
  );
}