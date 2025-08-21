// Utility functions for image processing and export

export const createImageFromFile = (file) => ({
  id: Date.now() + Math.random(),
  src: URL.createObjectURL(file),
  file,
  cropped: null
});

// Create a downscaled thumbnail Blob URL to reduce memory/paint cost in grids
export const createThumbnailFromSrc = async (imageSrc, maxSize = 512, mimeType = 'image/webp', quality = 0.8) => {
  // Try createImageBitmap for faster decode if available
  const fetchBlob = async () => {
    const res = await fetch(imageSrc);
    return await res.blob();
  };

  let bitmap = null;
  try {
    const blob = await fetchBlob();
    if ('createImageBitmap' in window) {
      bitmap = await createImageBitmap(blob);
    } else {
      const imgEl = await loadImage(URL.createObjectURL(blob));
      // Canvas draw works with HTMLImageElement; wrap in object for unified handling
      bitmap = imgEl;
    }
  } catch {
    // Fallback to HTMLImageElement pathway if fetch/bitmap fails (e.g., data URL)
    bitmap = await loadImage(imageSrc);
  }

  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;
  const scale = Math.min(1, maxSize / Math.max(originalWidth, originalHeight));
  const width = Math.max(1, Math.round(originalWidth * scale));
  const height = Math.max(1, Math.round(originalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);

  const url = await new Promise((resolve) => {
    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          resolve(canvas.toDataURL(mimeType, quality));
        }
      }, mimeType, quality);
    } else {
      resolve(canvas.toDataURL(mimeType, quality));
    }
  });

  try {
    if (bitmap && 'close' in bitmap) {
      bitmap.close();
    }
  } catch {}

  return url;
};

// Convert degrees to radians
const toRadian = (degree) => (degree * Math.PI) / 180;

// Compute the bounding box of a rotated rectangle
const getRotatedBoundingBox = (width, height, rotationRad) => {
  const cos = Math.abs(Math.cos(rotationRad));
  const sin = Math.abs(Math.sin(rotationRad));
  return {
    width: Math.floor(width * cos + height * sin),
    height: Math.floor(width * sin + height * cos)
  };
};

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new window.Image();
  // Helpful for cross-origin when possible; object URLs will ignore this
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

/**
 * Crop an image with support for rotation, flip, round mask, and output options
 *
 * @param {string} imageSrc - Source URL of the image
 * @param {{ x:number, y:number, width:number, height:number }} croppedAreaPixels - Crop box in pixels
 * @param {{
 *   rotation?: number,
 *   flip?: { horizontal?: boolean, vertical?: boolean },
 *   round?: boolean,
 *   output?: { type?: 'image/jpeg'|'image/png'|'image/webp', quality?: number },
 *   outputWidth?: number,
 *   outputHeight?: number
 * }} options
 * @returns {Promise<string>} data URL of the cropped image
 */
export const cropImage = async (imageSrc, croppedAreaPixels, options = {}) => {
  const {
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    round = false,
    output = { type: 'image/jpeg', quality: 0.92 },
    outputWidth,
    outputHeight
  } = options || {};

  const image = await loadImage(imageSrc);
  const rotationRad = toRadian(rotation);

  // Create a canvas that will contain the rotated image (safe area)
  const { width: bBoxWidth, height: bBoxHeight } = getRotatedBoundingBox(image.width, image.height, rotationRad);
  const safeArea = Math.max(bBoxWidth, bBoxHeight);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = safeArea;
  tempCanvas.height = safeArea;
  const tempCtx = tempCanvas.getContext('2d');

  // Move to center, apply rotation and flip, draw the image centered
  tempCtx.translate(safeArea / 2, safeArea / 2);
  tempCtx.rotate(rotationRad);
  tempCtx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  tempCtx.drawImage(image, -image.width / 2, -image.height / 2);

  // Compute the top-left of the image within the safe area
  const posX = (safeArea / 2) - (image.width / 2);
  const posY = (safeArea / 2) - (image.height / 2);

  // Prepare the destination canvas with desired output dimensions
  const destCanvas = document.createElement('canvas');
  const destWidth = outputWidth || croppedAreaPixels.width;
  const destHeight = outputHeight || croppedAreaPixels.height;
  destCanvas.width = destWidth;
  destCanvas.height = destHeight;
  const destCtx = destCanvas.getContext('2d');
  destCtx.imageSmoothingEnabled = true;
  destCtx.imageSmoothingQuality = 'high';

  // Draw the cropped region from the rotated temp canvas into the destination canvas
  destCtx.drawImage(
    tempCanvas,
    posX + croppedAreaPixels.x,
    posY + croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    destWidth,
    destHeight
  );

  // Apply round mask if requested
  if (round) {
    destCtx.globalCompositeOperation = 'destination-in';
    destCtx.beginPath();
    destCtx.arc(destWidth / 2, destHeight / 2, Math.min(destWidth, destHeight) / 2, 0, 2 * Math.PI, false);
    destCtx.closePath();
    destCtx.fill();
  }

  const mimeType = output?.type || 'image/jpeg';
  const quality = typeof output?.quality === 'number' ? output.quality : 0.92;

  // If output is JPEG (no alpha), paint a white background to avoid black fringing
  if (mimeType === 'image/jpeg') {
    const whiteCanvas = document.createElement('canvas');
    whiteCanvas.width = destCanvas.width;
    whiteCanvas.height = destCanvas.height;
    const whiteCtx = whiteCanvas.getContext('2d');
    whiteCtx.fillStyle = '#ffffff';
    whiteCtx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);
    whiteCtx.drawImage(destCanvas, 0, 0);
    destCanvas.width = whiteCanvas.width;
    destCanvas.height = whiteCanvas.height;
    const drawBackCtx = destCanvas.getContext('2d');
    drawBackCtx.drawImage(whiteCanvas, 0, 0);
  }

  // Prefer Blob URL to reduce memory and string size; fallback to data URL
  const blobUrl = await new Promise((resolve) => {
    if (destCanvas.toBlob) {
      destCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          resolve(destCanvas.toDataURL(mimeType, quality));
        }
      }, mimeType, quality);
    } else {
      resolve(destCanvas.toDataURL(mimeType, quality));
    }
  });

  return blobUrl;
};

export const exportCollage = (images) => {
  if (images.length === 0) return;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Simple grid layout - 2 columns
  const cols = 2;
  const rows = Math.ceil(images.length / cols);
  const itemWidth = 300;
  const itemHeight = 300;
  
  canvas.width = cols * itemWidth;
  canvas.height = rows * itemHeight;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  let loadedImages = 0;
  const totalImages = images.length;
  
  images.forEach((img, index) => {
    const image = new window.Image();
    image.decoding = 'async';
    image.loading = 'eager';
    image.onload = () => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * itemWidth;
      const y = row * itemHeight;
      
      ctx.drawImage(image, x, y, itemWidth, itemHeight);
      loadedImages++;
      
      if (loadedImages === totalImages) {
        // Download the canvas as image
        const link = document.createElement('a');
        link.download = 'collage.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    };
    image.src = img.cropped || img.src;
  });
};
