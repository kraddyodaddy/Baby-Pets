import React, { useState, useEffect } from 'react';
import { UploadedImage, TransformationResult } from '../types';
import { 
  XMarkIcon, MagicIcon, DownloadIcon, ClockIcon, 
  FacebookIcon, InstagramIcon, TwitterIcon, TikTokIcon, RedditIcon 
} from './Icons';

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
            <body style="margin:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background-color:#fafaf9; min-height:100vh; font-family: sans-serif; text-align:center; padding: 20px;">
              <img src="${result.generatedImageUrl}" style="max-width:100%; max-height:80vh; object-fit:contain; border-radius:12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" alt="Generated Baby Pet" />
              <div style="margin-top: 24px; color: #444; background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); max-width: 400px;">
                <h3 style="margin: 0 0 8px 0; color: #ec4899;">Share to ${platformName}</h3>
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

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------

  const renderResultState = () => {
    if (!result || result.status === 'idle') {
      return (
        <div className="text-center p-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm text-brand-300">
            <MagicIcon className="w-5 h-5" />
          </div>
          <p className="text-brand-800/60 font-medium text-xs leading-tight">Ready to<br/>transform</p>
        </div>
      );
    }
    if (isQueued) {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center w-full animate-pulse">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2 shadow-sm text-yellow-500">
            <ClockIcon className="w-5 h-5" />
          </div>
          <h3 className="text-yellow-700 font-bold text-sm mb-1">Queueing</h3>
          <p className="text-yellow-600 font-medium text-[10px] leading-tight">Waiting for slot...</p>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center w-full max-w-[90%]">
          <div className="w-full bg-white rounded-full h-1.5 mb-3 overflow-hidden shadow-inner border border-gray-100">
            <div 
              className="bg-gradient-to-r from-brand-300 to-brand-500 h-full rounded-full transition-all duration-300 ease-out relative" 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
            </div>
          </div>
          <p className="text-brand-600 font-display font-medium text-xs animate-pulse leading-tight">
            {currentMessage}
          </p>
        </div>
      );
    }
    if (isError) {
      return (
        <div className="text-center p-4 text-red-500 flex flex-col items-center justify-center h-full w-full">
          <div className="bg-red-50 p-2 rounded-full mb-1">
            <XMarkIcon className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-bold mb-1 text-gray-800">Failed</p>
          <p className="text-[10px] text-gray-600 leading-tight max-w-xs">{result.error || "Error"}</p>
        </div>
      );
    }
    if (isSuccess && result.generatedImageUrl) {
      return (
        <img 
          src={result.generatedImageUrl} 
          alt="Baby Pet Version" 
          className="w-full h-full object-cover animate-fade-in absolute inset-0 md:static"
        />
      );
    }
    return null;
  };

  const renderNameInput = () => (
    <div className="w-full animate-fade-in-up">
      <label className="block text-sm font-extrabold text-gray-700 mb-2">
        What's your pet's name? <span className="text-brand-500">*</span>
      </label>
      <input 
        type="text" 
        value={upload.petName}
        onChange={(e) => onNameChange(upload.id, e.target.value)}
        placeholder="Enter name (e.g. Fluffy)"
        required
        autoFocus={!upload.petName} // Auto focus if name is empty
        className="w-full text-lg px-4 py-3 rounded-xl border-2 border-brand-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all placeholder:text-gray-300 bg-white shadow-sm"
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
          className="flex-1 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 py-3 md:py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          Again
        </button>
        <button 
          onClick={() => onRegenerate(upload.id, "Use a softer, dreamier, alternate artistic style.")}
          className="flex-1 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 py-3 md:py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          New Style
        </button>
      </div>
    );
  };

  const renderShareBar = () => {
    if (!isSuccess) return null;
    return (
      <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-100 w-full shadow-sm">
        <span className="text-[10px] font-bold text-gray-500 px-1 uppercase tracking-wide hidden xs:block">Share:</span>
        <div className="flex space-x-2 justify-between w-full xs:w-auto">
          <button onClick={() => handleShare('Facebook')} disabled={isSharing} className="p-2 text-blue-600 bg-white hover:bg-blue-50 border border-gray-100 rounded-lg transition-colors shadow-sm"><FacebookIcon className="w-5 h-5" /></button>
          <button onClick={() => handleShare('Instagram')} disabled={isSharing} className="p-2 text-pink-600 bg-white hover:bg-pink-50 border border-gray-100 rounded-lg transition-colors shadow-sm"><InstagramIcon className="w-5 h-5" /></button>
          <button onClick={() => handleShare('Twitter')} disabled={isSharing} className="p-2 text-gray-800 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm"><TwitterIcon className="w-5 h-5" /></button>
          <button onClick={() => handleShare('TikTok')} disabled={isSharing} className="p-2 text-black bg-white hover:bg-gray-50 border border-gray-100 rounded-lg transition-colors shadow-sm"><TikTokIcon className="w-5 h-5" /></button>
          <button onClick={() => handleShare('Reddit')} disabled={isSharing} className="p-2 text-orange-600 bg-white hover:bg-orange-50 border border-gray-100 rounded-lg transition-colors shadow-sm"><RedditIcon className="w-5 h-5" /></button>
        </div>
      </div>
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
        className="bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center font-bold text-base w-full active:transform active:scale-95 cursor-pointer"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        {isMobile ? 'Save Image' : 'Download Image'}
      </a>
    );
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative flex flex-col md:flex-row ${className}`}>
      
      {/* Remove Button (Absolute) */}
      <button 
        onClick={() => onRemove(upload.id)}
        className="absolute top-2 right-2 z-40 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-500 p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors border border-gray-100"
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
        {/* Reduced height from h-64/96 to h-52 (208px) to h-64 max to allow space for input */}
        <div className="flex flex-row w-full h-52 xs:h-64 sm:h-80 border-b border-gray-100">
           {/* Left: Original */}
           <div className="w-1/2 relative border-r border-gray-100 bg-gray-50">
             <img src={upload.previewUrl} alt="Original" className="w-full h-full object-cover" />
             <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">Original</div>
           </div>
           
           {/* Right: Result */}
           <div className="w-1/2 relative bg-brand-50 flex flex-col items-center justify-center">
             {renderResultState()}
             {isSuccess && <div className="absolute bottom-2 right-2 bg-brand-500/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">Baby Pet</div>}
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
               
               {/* d) Download Button */}
               {renderDownloadButton()}
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
        <div className="flex flex-col flex-1 border-r border-gray-100 relative w-1/2">
           <div className="relative flex-1 bg-gray-50 overflow-hidden">
             <img src={upload.previewUrl} alt="Original" className="w-full h-full object-cover" />
             <div className="absolute bottom-4 left-4 bg-black/40 text-white text-xs px-2 py-1 rounded-md backdrop-blur-md">Original</div>
           </div>
           <div className="shrink-0 p-4 bg-white border-t border-gray-100 z-10">
             {/* Hide input on desktop too if success, replace with name */}
             {!isSuccess ? renderNameInput() : (
                <div className="text-center py-2">
                   <h3 className="font-display font-bold text-xl text-gray-800">Baby {upload.petName}</h3>
                </div>
             )}
           </div>
        </div>

        {/* Right Side: Result + Overlays */}
        <div className="relative flex-1 bg-brand-50 flex flex-col items-center justify-center overflow-hidden w-1/2">
           {renderResultState()}
           
           {/* Desktop Overlays for Success State */}
           {isSuccess && (
             <>
                {/* Top Regenerate Buttons */}
                {!isLimitReached && (
                  <div className="absolute top-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                     <button 
                       onClick={() => onRegenerate(upload.id)}
                       className="bg-white/90 hover:bg-white text-xs font-medium text-brand-600 px-4 py-2 rounded-full shadow-md backdrop-blur-sm transform hover:scale-105 transition-all"
                     >
                       Again
                     </button>
                     <button 
                       onClick={() => onRegenerate(upload.id, "Use a softer, dreamier, alternate artistic style.")}
                       className="bg-white/90 hover:bg-white text-xs font-medium text-brand-600 px-4 py-2 rounded-full shadow-md backdrop-blur-sm transform hover:scale-105 transition-all"
                     >
                       New Style
                     </button>
                  </div>
                )}

                {/* Bottom Actions (Share & Download) */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-2 z-20">
                   <div className="bg-white/90 backdrop-blur-md rounded-xl p-2 shadow-lg flex items-center justify-between border border-white/50">
                      <span className="text-[10px] font-bold text-gray-500 px-2 uppercase tracking-wide">Share:</span>
                      <div className="flex space-x-1">
                        <button onClick={() => handleShare('Facebook')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FacebookIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleShare('Instagram')} className="p-1.5 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"><InstagramIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleShare('Twitter')} className="p-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"><TwitterIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleShare('TikTok')} className="p-1.5 text-black hover:bg-gray-100 rounded-lg transition-colors"><TikTokIcon className="w-5 h-5" /></button>
                      </div>
                   </div>
                   {renderDownloadButton()}
                </div>
             </>
           )}
        </div>
      </div>

    </div>
  );
}