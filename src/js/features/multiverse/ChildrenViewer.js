import React from 'react';
import { Button } from "react-bootstrap";
import { CHARACTER } from "./objectTypes";

const ChildrenViewer = ({ objects, title = 'Children', onAction }) => {
  console.log(objects);
  return (
    <div className="inventory-viewer">
      <h3>{title}</h3>
      <ul>
        {objects.map((object, index) => {
          return (
            <li key={index}>
              <p>{object.displayName}</p>
              {
                onAction && (object._type !== CHARACTER) && (
                  <Button
                    size="sm"
                    onClick={() => onAction(object)}
                  >
                    Take
                  </Button>
                )
              }
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChildrenViewer;
