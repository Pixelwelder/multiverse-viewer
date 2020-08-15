import React from 'react';
import { Button } from 'react-bootstrap';

import { ROOM } from '../../multiverse/constants';

const ObjectViewer = ({ object, onAction }) => {
  return (
    <div className="object-viewer">
      {object && (
        <>
          {onAction && (object._type === ROOM) && (
            <Button
              onClick={() => onAction(object)}
            >
              Go Here
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ObjectViewer;
