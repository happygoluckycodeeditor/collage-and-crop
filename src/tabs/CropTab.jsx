import React from 'react';
import ImageGrid from '../components/ImageGrid';
import EmptyState from '../components/EmptyState';

const CropTab = ({ images, onCropImage, onRemoveImage }) => {
  return (
    <div className="content">
      {images.length === 0 ? (
        <EmptyState 
          icon="✂️"
          message="No images to crop. Upload some images first."
        />
      ) : (
        <ImageGrid
          images={images}
          onCropImage={onCropImage}
          onRemoveImage={onRemoveImage}
        />
      )}
    </div>
  );
};

export default CropTab;
