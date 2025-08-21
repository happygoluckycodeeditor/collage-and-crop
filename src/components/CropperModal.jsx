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
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [roundMask, setRoundMask] = useState(false);
  const [aspect, setAspect] = useState(1);
  const [format, setFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(0.92);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = () => {
    if (croppedAreaPixels) {
      onSave(croppedAreaPixels, {
        rotation,
        flip: { horizontal: flipH, vertical: flipV },
        round: roundMask,
        output: { type: format, quality: Number(quality) }
      });
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
            rotation={rotation}
            aspect={aspect || undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            cropShape={roundMask ? 'round' : 'rect'}
            showGrid
          />
        </div>
        <div className="cropper-controls" style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Zoom</span>
            <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Rotation ({rotation}°)</span>
            <input type="range" min="-180" max="180" step="1" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => setRotation((r) => (r + 90) % 360)}>↻ 90°</button>
            <button className="btn btn-secondary" onClick={() => setFlipH((v) => !v)}>Flip H</button>
            <button className="btn btn-secondary" onClick={() => setFlipV((v) => !v)}>Flip V</button>
            <button className="btn btn-secondary" onClick={() => setRoundMask((v) => !v)}>{roundMask ? 'Rect' : 'Round'}</button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ alignSelf: 'center' }}>Aspect:</span>
            <button className={`btn btn-secondary${aspect === undefined ? ' active' : ''}`} onClick={() => setAspect(undefined)}>Free</button>
            <button className={`btn btn-secondary${aspect === 1 ? ' active' : ''}`} onClick={() => setAspect(1)}>1:1</button>
            <button className={`btn btn-secondary${aspect === 4/3 ? ' active' : ''}`} onClick={() => setAspect(4/3)}>4:3</button>
            <button className={`btn btn-secondary${aspect === 16/9 ? ' active' : ''}`} onClick={() => setAspect(16/9)}>16:9</button>
            <button className={`btn btn-secondary${aspect === 3/4 ? ' active' : ''}`} onClick={() => setAspect(3/4)}>3:4</button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ alignSelf: 'center' }}>Format:</span>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
            </select>
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Quality</span>
              <input type="range" min="0.1" max="1" step="0.01" value={quality} onChange={(e) => setQuality(e.target.value)} />
            </label>
          </div>
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
