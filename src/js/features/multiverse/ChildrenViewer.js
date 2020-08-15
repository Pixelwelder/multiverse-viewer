import React from 'react';
import { Button } from "react-bootstrap";
import { CHARACTER } from "./objectTypes";

const ChildrenViewer = ({ objects, title = 'Children', onAction }) => {
  console.log(objects);
  return (
    <div className="inventory-viewer">
      <h3>{title}</h3>
      <ul>
        {objects.map((item, index) => {
          return (
            <li key={index}>
              <p>{item.displayName}</p>
              {
                item._type !== CHARACTER && (
                  <Button
                    size="sm"
                    onClick={() => onAction('name')}
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
