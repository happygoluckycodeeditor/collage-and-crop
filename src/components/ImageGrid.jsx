import React from 'react';

const ImageGrid = ({ images, onCropImage, onRemoveImage }) => {
  return (
    <div className="image-grid">
      {images.map((img, idx) => (
        <div key={img.id} className="image-item" style={{ contentVisibility: 'auto', containIntrinsicSize: '150px 150px' }}>
          <img src={img.cropped || img.thumb || img.src} alt={`uploaded-${idx}`} loading="lazy" decoding="async" />
          <div className="image-actions">
            <button 
              className="image-btn" 
              onClick={() => onCropImage(idx)} 
              title="Crop"
            >
              ✂️
            </button>
            <button 
              className="image-btn" 
              onClick={() => onRemoveImage(idx)} 
              title="Remove"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
