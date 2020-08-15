import React from 'react';
import { Button } from 'react-bootstrap';
import ReactMarkdown from "react-markdown";

import { ROOM } from '../../multiverse/constants';

const ObjectViewer = ({ object, onAction }) => {
  return (
    <div className="object-viewer">
      {object && (
        <>
          <ReactMarkdown source={object.description || ''} />
          {/*<p>{object.description}</p>*/}

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
