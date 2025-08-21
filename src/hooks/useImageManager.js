import { useState } from 'react';
import { createImageFromFile, cropImage, createThumbnailFromSrc } from '../utils/imageUtils';

export const useImageManager = () => {
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const newImages = fileArray.map(createImageFromFile);
    setImages(prev => [...prev, ...newImages]);
    // Generate thumbnails asynchronously without blocking UI
    queueMicrotask(async () => {
      for (const img of newImages) {
        try {
          const thumb = await createThumbnailFromSrc(img.src, 512);
          setImages(prev => prev.map(it => it.id === img.id ? { ...it, thumb } : it));
        } catch {}
      }
    });
    return newImages.length > 0;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver((prev) => (prev ? prev : true));
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver((prev) => (prev ? false : prev));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    return handleImageUpload(files);
  };

  // Per-item cleanup is handled in removeImage and when replacing cropped URLs

  const removeImage = (index) => {
    setImages(prev => {
      const target = prev[index];
      if (target) {
        // Revoke object URLs to free memory
        try { URL.revokeObjectURL(target.src); } catch {}
        if (target.cropped && target.cropped.startsWith('blob:')) {
          try { URL.revokeObjectURL(target.cropped); } catch {}
        }
        if (target.thumb && target.thumb.startsWith('blob:')) {
          try { URL.revokeObjectURL(target.thumb); } catch {}
        }
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const updateImageCrop = async (index, croppedAreaPixels, options) => {
    const img = images[index];
    const croppedSrc = await cropImage(img.src, croppedAreaPixels, options);
    setImages(prev => prev.map((item, idx) => {
      if (idx !== index) return item;
      // Revoke previous cropped URL if it was a blob URL
      if (item.cropped && item.cropped.startsWith('blob:')) {
        try { URL.revokeObjectURL(item.cropped); } catch {}
      }
      return { ...item, cropped: croppedSrc };
    }));
  };

  return {
    images,
    dragOver,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    updateImageCrop
  };
};
