import React from 'react';

const ChildrenViewer = ({ object, title = 'Children' }) => {
  console.log('OBJECT', object);
  return (
    <div className="inventory-viewer">
      <h3>{title}</h3>
      {object && (
        <ul>
          {Object.entries(object.children).map(([name, item], index) => {
            return (
              <li key={index}>{name}</li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChildrenViewer;
