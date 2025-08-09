import { useState } from 'react';
import { createImageFromFile, cropImage } from '../utils/imageUtils';

export const useImageManager = () => {
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const newImages = fileArray.map(createImageFromFile);
    setImages(prev => [...prev, ...newImages]);
    return newImages.length > 0;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    return handleImageUpload(files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateImageCrop = async (index, croppedAreaPixels) => {
    const img = images[index];
    const croppedSrc = await cropImage(img.src, croppedAreaPixels);
    setImages(prev => prev.map((img, idx) => 
      idx === index ? { ...img, cropped: croppedSrc } : img
    ));
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
