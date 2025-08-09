import React, { useState } from 'react';
import Cropper from 'react-easy-crop';

const CropperModal = ({ 
  isOpen, 
  imageSrc, 
  onClose, 
  onSave 
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = () => {
    if (croppedAreaPixels) {
      onSave(croppedAreaPixels);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cropper-modal">
      <div className="cropper-content">
        <h3>Crop Image</h3>
        <div className="cropper-container">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="cropper-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropperModal;
