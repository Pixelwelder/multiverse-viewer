import React from 'react';

const ObjectViewer = ({ object }) => {
  return (
    <div className="object-viewer">
      <h3>Object Viewer</h3>
      {object && (
        <>
          <p>{object.displayName}</p>
          <p>{object.description}</p>
        </>
      )}
    </div>
  );
};

export default ObjectViewer;
