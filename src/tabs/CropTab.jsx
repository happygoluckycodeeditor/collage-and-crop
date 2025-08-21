import React, { useState } from 'react';
import ImageGrid from '../components/ImageGrid';
import EmptyState from '../components/EmptyState';
import UploadArea from '../components/UploadArea';
import CropperModal from '../components/CropperModal';
import { useImageManager } from '../hooks/useImageManager';

const CropTab = () => {
  const [croppingIndex, setCroppingIndex] = useState(null);

  const {
    images,
    dragOver,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    updateImageCrop
  } = useImageManager();

  const onCropImage = (index) => setCroppingIndex(index);
  const onClose = () => setCroppingIndex(null);
  const onSave = async (croppedAreaPixels, options) => {
    if (croppingIndex !== null) {
      await updateImageCrop(croppingIndex, croppedAreaPixels, options);
      setCroppingIndex(null);
    }
  };

  const handleExportCrops = () => {
    if (images.length === 0) return;
    images.forEach((img, idx) => {
      const href = img.cropped || img.src;
      const link = document.createElement('a');
      link.href = href;
      link.download = `crop-${idx + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="content">
      <UploadArea
        onFileUpload={handleImageUpload}
        dragOver={dragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />

      {images.length === 0 ? (
        <EmptyState 
          icon="✂️"
          message="No images to crop. Upload some images above."
        />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleExportCrops}>Export Crops</button>
          </div>
          <ImageGrid
            images={images}
            onCropImage={onCropImage}
            onRemoveImage={removeImage}
          />
        </>
      )}

      <CropperModal
        isOpen={croppingIndex !== null}
        imageSrc={croppingIndex !== null ? images[croppingIndex]?.src : null}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
};

export default CropTab;
