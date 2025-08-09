import React from 'react';
import CollagePreview from '../components/CollagePreview';
import EmptyState from '../components/EmptyState';

const CollageTab = ({ images }) => {
  return (
    <div className="content">
      {images.length === 0 ? (
        <EmptyState 
          icon="🖼️"
          message="No images for collage. Upload and crop some images first."
        />
      ) : (
        <CollagePreview images={images} />
      )}
    </div>
  );
};

export default CollageTab;
