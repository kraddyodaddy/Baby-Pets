import React, { useRef, useState } from 'react';
import { UploadIcon, PawIcon } from './Icons';

interface UploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  count: number;
}

const MAX_UPLOADS = 3;

export const Uploader: React.FC<UploaderProps> = ({ onFilesSelected, disabled, count }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(selectedFiles);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBoxClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isFull) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled && !isFull && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const isFull = count >= MAX_UPLOADS;

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        multiple={MAX_UPLOADS > 1}
        disabled={disabled || isFull}
      />
      <div
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-4 border-solid rounded-[2rem] p-6 min-h-[220px] md:min-h-[280px]
          flex flex-col items-center justify-center text-center 
          transition-all duration-300 ease-in-out cursor-pointer group
          ${isFull 
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
            : isDragOver
              ? 'border-pastel-purple bg-pastel-pink-light scale-[1.02] shadow-xl'
              : 'border-pastel-pink bg-pastel-pink-superlight hover:bg-white hover:border-pastel-purple hover:shadow-2xl hover:scale-[1.01]'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Background Decorative Icon */}
        {!isFull && (
           <PawIcon className="absolute opacity-5 w-40 h-40 text-pastel-pink pointer-events-none transform -rotate-12" />
        )}

        <div className={`
            relative p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110
            ${isFull ? 'bg-gray-100 text-gray-400' : 'bg-white text-pastel-pink shadow-md group-hover:text-pastel-purple'}
        `}>
          <UploadIcon className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        
        <h3 className="relative font-display text-xl md:text-2xl font-bold text-gray-700 mb-2 group-hover:text-brand-600 transition-colors">
          {isFull ? "Max photos added" : "Click or drag photos here"}
        </h3>
        
        <p className="relative text-gray-500 text-sm md:text-base max-w-sm font-medium">
          {isFull 
            ? "You have added 3 photos." 
            : `Upload up to ${MAX_UPLOADS} photos, tell us their names, and watch as pets turn into adorable babies.`}
        </p>

        {!isFull && (
            <p className="relative text-gray-400 text-xs mt-2 max-w-xs italic">
                (Use clear, close-up photos for best results)
            </p>
        )}
      </div>
    </div>
  );
};