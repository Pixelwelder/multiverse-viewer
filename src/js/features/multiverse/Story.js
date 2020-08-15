import React from 'react';
import { actions as multiverseActions, selectors as multiverseSelectors } from "./multiverseSlice2";
import ObjectViewer from "./ObjectViewer";
import { useDispatch, useSelector } from "react-redux";
import { selectors } from "./selectors";

const Story = () => {
  const selectedObject = useSelector(selectors.selectSelectedObject);
  const playerRoom = useSelector(multiverseSelectors.selectPlayerRoom);
  const dispatch = useDispatch();

  return (
    <div className="story">
      <h2>Story</h2>
      <ObjectViewer
        object={selectedObject}
        onAction={selectedObject !== playerRoom
          ? object => dispatch(multiverseActions.reparent({ newParentName: object.toString() }))
          : null
        }
      />
    </div>
  );
};

export default Story;
