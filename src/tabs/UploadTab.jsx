import React from 'react';
import UploadArea from '../components/UploadArea';
import EmptyState from '../components/EmptyState';

const UploadTab = ({ images, onFileUpload, dragOver, onDragOver, onDragLeave, onDrop }) => {
  return (
    <div className="content">
      <UploadArea
        onFileUpload={onFileUpload}
        dragOver={dragOver}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />
      
      {images.length === 0 && (
        <EmptyState 
          icon="🖼️"
          message="No images uploaded yet. Start by uploading some images above."
        />
      )}
    </div>
  );
};

export default UploadTab;
