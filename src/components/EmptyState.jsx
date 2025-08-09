import React from 'react';

const EmptyState = ({ icon, message }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
