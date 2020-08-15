import React from 'react'
import Log from "../log/Log";
import { useDispatch, useSelector } from "react-redux";
import { selectors as logSelectors } from "../log/logSlice";
import ChildrenViewer from "./ChildrenViewer";
import { actions as multiverseActions, selectors as multiverseSelectors } from "./multiverseSlice2";
import { selectors } from "./selectors";
import ObjectViewer from "./ObjectViewer";

const MetaBar = () => {
  const { messages } = useSelector(logSelectors.select);
  const inventory = useSelector(multiverseSelectors.selectPlayerChildren);
  const selectedObjectChildren = useSelector(selectors.selectSelectedObjectChildren);
  const selectedObject = useSelector(selectors.selectSelectedObject);
  const playerRoom = useSelector(multiverseSelectors.selectPlayerRoom);
  const dispatch = useDispatch();

  return (
    <div className="meta-bar">
      <ChildrenViewer title="Inventory" objects={inventory} />
      <ChildrenViewer
        title="Here"
        objects={selectedObjectChildren}
        onAction={object => {
          dispatch(multiverseActions.reparent({ object, newParentName: 'player' }));
        }}
      />
      <ObjectViewer
        object={selectedObject}
        onAction={selectedObject !== playerRoom
          ? object => dispatch(multiverseActions.reparent({ newParentName: object.toString() }))
          : null
        }
      />
      <Log messages={messages} />
    </div>
  );
};

export default MetaBar;
