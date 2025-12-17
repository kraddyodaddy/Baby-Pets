
/**
 * Compresses a Data URL image to a target file size and max dimensions.
 */
export const compressImage = async (
  dataUrl: string, 
  maxWidth: number = 1024, 
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Export as compressed JPEG
      // JPEG is generally better for photorealistic pet images than PNG for size
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

/**
 * Utility to calculate Base64 size in bytes
 */
export const getBase64Size = (base64String: string): number => {
  const padding = base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0;
  return (base64String.length * 0.75) - padding;
};
