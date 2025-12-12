import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

interface UploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  count: number;
}

export const Uploader: React.FC<UploaderProps> = ({ onFilesSelected, disabled, count }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(selectedFiles);
      // Reset input so same files can be selected again if user deletes them
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

  const isFull = count >= 1;

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={disabled || isFull}
      />
      <div
        onClick={handleBoxClick}
        className={`
          relative border-2 border-solid rounded-3xl p-8 min-h-[300px] md:min-h-[auto]
          flex flex-col items-center justify-center text-center 
          transition-all duration-300 ease-in-out cursor-pointer
          ${isFull 
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
            : 'border-pastel-pink bg-pastel-pink-superlight hover:bg-brand-100 hover:border-pastel-purple hover:shadow-md'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className={`p-4 rounded-full mb-3 ${isFull ? 'bg-gray-100 text-gray-400' : 'bg-white text-pastel-pink shadow-sm'}`}>
          <UploadIcon className="w-10 h-10" />
        </div>
        <h3 className="font-display text-2xl font-bold text-gray-700 mb-2">
          {isFull ? "Photo Added" : "Upload Pet Photo"}
        </h3>
        <p className="text-gray-500 text-base max-w-xs">
          {isFull 
            ? "You have added a photo." 
            : "Select a clear photo of your furry friend."}
        </p>
      </div>
    </div>
  );
};