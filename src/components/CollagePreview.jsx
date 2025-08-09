import React from 'react';

const CollagePreview = ({ images }) => {
  return (
    <div className="collage-grid">
      {images.map((img, idx) => (
        <div key={img.id} className="collage-item">
          <img src={img.cropped || img.src} alt={`collage-${idx}`} />
        </div>
      ))}
    </div>
  );
};

export default CollagePreview;
