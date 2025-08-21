import React, { useState } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import UploadTab from './tabs/UploadTab';
import CropTab from './tabs/CropTab';
import CollageTab from './tabs/CollageTab';
import { useImageManager } from './hooks/useImageManager';
import { exportCollage } from './utils/imageUtils';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  
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
          <CropTab />
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

      {/* Cropper modal is now fully managed inside CropTab */}
    </div>
  );
}

export default App;
