import React, { useRef } from 'react';

const UploadArea = ({ onFileUpload, dragOver, onDragOver, onDragLeave, onDrop }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    onFileUpload(e.target.files);
  };

  return (
    <div 
      className={`upload-area ${dragOver ? 'drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={handleClick}
    >
      <div className="upload-icon">📁</div>
      <div className="upload-title">Upload Images</div>
      <div className="upload-subtitle">Drag and drop your images here, or click to browse</div>
      <button className="btn btn-primary">Choose Files</button>
      <div className="upload-formats">Supports: JPG, PNG, GIF, WebP</div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="file-input"
      />
    </div>
  );
};

export default UploadArea;
