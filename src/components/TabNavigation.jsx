import React from 'react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'upload', label: 'Upload', icon: '📁' },
    { id: 'crop', label: 'Crop', icon: '✂️' },
    { id: 'collage', label: 'Collage', icon: '🖼️' }
  ];

  return (
    <nav className="tabs">
      <ul className="tab-list">
        {tabs.map(tab => (
          <li 
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TabNavigation;
