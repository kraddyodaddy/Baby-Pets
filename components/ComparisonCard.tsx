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
  'Baby pets incoming...',
  'Get ready to see your angel as a baby...',
  'Preparing extra cute fluff...',
  'Almost there, do the cute pet voice...',
  'Turning your best friend into a baby...',
  'Squeal level cuteness loading...'
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
      setCurrentMessage(LOADING_MESSAGES[0]);
      let msgIndex = 0;

      // Progress bar simulation: approach 95% over time
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return 95;
          const remaining = 95 - prev;
          // Move roughly 5% of the remaining distance per tick to simulate deceleration
          return prev + (remaining * 0.05);
        });
      }, 400);

      // Cycle messages every 2.5 seconds to ensure at least ~3 are shown in a typical 8-10s wait
      messageInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
        setCurrentMessage(LOADING_MESSAGES[msgIndex]);
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
      // We explicitly check if the browser can share the *files* array.
      // Many desktop browsers have navigator.share but do NOT support files, returning false here.
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
      // If user cancelled the native share dialog, don't show fallback
      if (error.name === 'AbortError') {
        setIsSharing(false);
        return;
      }

      // 3. Fallback: Open in new tab for manual saving/sharing
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

  return (
    <div className={`bg-white rounded-2xl overflow-hidden relative group flex flex-col md:flex-row ${className}`}>
      {/* Remove Button */}
      <button 
        onClick={() => onRemove(upload.id)}
        className="absolute top-2 right-2 md:left-2 md:right-auto z-30 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 p-1.5 rounded-full shadow-sm backdrop-blur-sm transition-colors"
        title="Remove photo"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>

      {/* LEFT SIDE (Mobile: Top Half) - Original Image & Input */}
      <div className="flex flex-col md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-100 relative">
        {/* Original Image Container */}
        <div className="relative flex-1 min-h-0 bg-gray-50 overflow-hidden">
          <img 
            src={upload.previewUrl} 
            alt="Original Pet" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-1 rounded-md backdrop-blur-md">
            Original
          </div>
        </div>
        
        {/* Compact Name Input Section */}
        <div className="shrink-0 p-3 bg-white border-t border-gray-100 z-10">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Pet Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={upload.petName}
            onChange={(e) => onNameChange(upload.id, e.target.value)}
            placeholder="e.g. Fluffy"
            required
            className="w-full text-[14pt] px-3 py-1.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-gray-400"
            disabled={isLoading || isSuccess || isQueued} 
          />
        </div>
      </div>

      {/* RIGHT SIDE (Mobile: Bottom Half) - Result Image / Status */}
      <div className="relative md:w-1/2 h-1/2 md:h-full bg-brand-50 flex flex-col items-center justify-center overflow-hidden">
        {!result || result.status === 'idle' ? (
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-brand-300">
              <MagicIcon className="w-6 h-6" />
            </div>
            <p className="text-brand-800/60 font-medium text-sm">Ready to transform</p>
          </div>
        ) : isQueued ? (
          <div className="flex flex-col items-center justify-center p-8 text-center w-full animate-pulse">
             <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3 shadow-sm text-yellow-500">
               <ClockIcon className="w-6 h-6" />
             </div>
             <h3 className="text-yellow-700 font-bold text-base mb-1">High demand</h3>
             <p className="text-yellow-600 font-medium text-xs">Your baby pet will be ready soon.</p>
          </div>
        ) : isLoading ? (
           <div className="flex flex-col items-center justify-center p-6 text-center w-full max-w-[80%]">
              <div className="w-full bg-white rounded-full h-2 mb-4 overflow-hidden shadow-inner border border-gray-100">
                <div 
                  className="bg-gradient-to-r from-brand-300 to-brand-500 h-full rounded-full transition-all duration-300 ease-out relative" 
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                </div>
              </div>
              <p className="text-brand-600 font-display font-medium text-base animate-pulse min-h-[24px] transition-all duration-500">
                {currentMessage}
              </p>
           </div>
        ) : isError ? (
          <div className="text-center p-6 text-red-500 flex flex-col items-center justify-center h-full w-full">
             <div className="bg-red-50 p-2 rounded-full mb-2">
               <XMarkIcon className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold mb-1 text-gray-800">Transformation Issue</p>
             <p className="text-xs text-gray-600 px-4 leading-relaxed max-w-xs">{result.error || "Transformation failed."}</p>
          </div>
        ) : isSuccess && result.generatedImageUrl ? (
          <>
            <img 
              src={result.generatedImageUrl} 
              alt="Baby Version" 
              className="w-full h-full object-cover animate-fade-in"
            />
            
            {/* Action Buttons Overlay */}
            <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 flex flex-col space-y-2 z-20">
              
              {/* Social Share Bar */}
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-1.5 shadow-lg flex items-center justify-between border border-white/50">
                <span className="text-[10px] font-bold text-gray-500 px-1 uppercase tracking-wide hidden sm:block">Share:</span>
                <div className="flex space-x-0.5 justify-around w-full sm:w-auto">
                  <button onClick={() => handleShare('Facebook')} disabled={isSharing} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Share to Facebook">
                    <FacebookIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleShare('Instagram')} disabled={isSharing} className="p-1.5 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors" title="Share to Instagram">
                    <InstagramIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleShare('Twitter')} disabled={isSharing} className="p-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="Share to Twitter">
                    <TwitterIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleShare('TikTok')} disabled={isSharing} className="p-1.5 text-black hover:bg-gray-100 rounded-lg transition-colors" title="Share to TikTok">
                    <TikTokIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleShare('Reddit')} disabled={isSharing} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Share to Reddit">
                    <RedditIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Download Button */}
              <a 
                href={result.generatedImageUrl} 
                download={`baby-${upload.petName || 'pet'}.png`}
                className="bg-white/90 backdrop-blur-md hover:bg-white text-brand-600 py-2 rounded-xl shadow-lg transition-colors flex items-center justify-center font-medium text-xs md:text-sm border border-white/50"
                title="Download Image"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download Image
              </a>
            </div>

            {/* Regenerate Options (Only if limit not reached) */}
            {!isLimitReached && (
              <div className="absolute top-2 left-2 right-2 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <button 
                  onClick={() => onRegenerate(upload.id)}
                  className="bg-white/90 hover:bg-white text-[10px] md:text-xs font-medium text-brand-600 px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm transition-transform hover:scale-105"
                >
                  Make another version
                </button>
                <button 
                  onClick={() => onRegenerate(upload.id, "Use a softer, dreamier, alternate artistic style.")}
                  className="bg-white/90 hover:bg-white text-[10px] md:text-xs font-medium text-brand-600 px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm transition-transform hover:scale-105"
                >
                  Try a different style
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};