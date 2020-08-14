import React from 'react';
import { Button } from "react-bootstrap";

const ChildrenViewer = ({ object, title = 'Children', onAction }) => {
  return (
    <div className="inventory-viewer">
      <h3>{title}</h3>
      {object && (
        <ul>
          {Object.entries(object.children).map(([name, item], index) => {
            return (
              <li key={index}>
                <p>{name}</p>
                <Button
                  size="sm"
                  onClick={() => onAction(name)}
                >
                  Take
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChildrenViewer;
