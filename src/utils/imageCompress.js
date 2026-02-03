/**
 * Compress an image for faster upload. Resizes to max 1200px and compresses to JPEG.
 * @param {string} dataUrl - Base64 data URL (e.g. from FileReader)
 * @param {number} maxSize - Max dimension in pixels (default 1200)
 * @param {number} quality - JPEG quality 0–1 (default 0.85)
 * @returns {Promise<string>} Compressed data URL
 */
export const compressImage = (dataUrl, maxSize = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= maxSize && height <= maxSize) {
        resolve(dataUrl);
        return;
      }
      if (width > height) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
};
