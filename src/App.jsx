import React, { useState } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import CropperModal from './components/CropperModal';
import UploadTab from './tabs/UploadTab';
import CropTab from './tabs/CropTab';
import CollageTab from './tabs/CollageTab';
import { useImageManager } from './hooks/useImageManager';
import { exportCollage } from './utils/imageUtils';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
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

  const handleFileUpload = (files) => {
    const hasNewImages = handleImageUpload(files);
    if (hasNewImages) {
      setActiveTab('crop');
    }
  };

  const handleCropImage = (index) => {
    setCroppingIndex(index);
  };

  const handleSaveCrop = async (croppedAreaPixels) => {
    if (croppingIndex !== null) {
      await updateImageCrop(croppingIndex, croppedAreaPixels);
      setCroppingIndex(null);
    }
  };

  const handleCloseCropper = () => {
    setCroppingIndex(null);
  };

  const handleExport = () => {
    exportCollage(images);
  };

  const handleSaveProject = () => {
    // TODO: Implement save project functionality
    console.log('Save project functionality to be implemented');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <UploadTab
            images={images}
            onFileUpload={handleFileUpload}
            dragOver={dragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        );
      case 'crop':
        return (
          <CropTab
            images={images}
            onCropImage={handleCropImage}
            onRemoveImage={removeImage}
          />
        );
      case 'collage':
        return (
          <CollageTab images={images} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Header
        onSaveProject={handleSaveProject}
        onExport={handleExport}
        hasImages={images.length > 0}
      />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderTabContent()}

      <CropperModal
        isOpen={croppingIndex !== null}
        imageSrc={croppingIndex !== null ? images[croppingIndex]?.src : null}
        onClose={handleCloseCropper}
        onSave={handleSaveCrop}
      />
    </div>
  );
}

export default App;
