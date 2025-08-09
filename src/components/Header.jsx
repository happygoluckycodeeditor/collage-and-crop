import React from 'react';

const Header = ({ onSaveProject, onExport, hasImages }) => {
  return (
    <header className="header">
      <h1>
        <span>🎨</span>
        Collage & Crop
      </h1>
      <div className="header-actions">
        <button className="btn btn-secondary" onClick={onSaveProject}>
          Save Project
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onExport} 
          disabled={!hasImages}
        >
          Export
        </button>
      </div>
    </header>
  );
};

export default Header;
