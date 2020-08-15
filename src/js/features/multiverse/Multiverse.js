import React from 'react';

import './style.scss';

import Graph from "./Graph";
import ChildrenViewer from "./ChildrenViewer";
import { selectors as uiSelectors } from "./uiSlice";
import { selectors as multiverseSelectors, actions as multiverseActions } from "./multiverseSlice2";
import { selectors } from "./selectors";
import { useDispatch, useSelector } from "react-redux";
import ObjectViewer from "./ObjectViewer";

const Multiverse = () => {
  const { selectedNode } = useSelector(uiSelectors.select);
  const meta = useSelector(multiverseSelectors.selectMeta);
  const player = useSelector(multiverseSelectors.selectPlayer);
  const selectedObject = useSelector(selectors.selectSelectedObject);
  const selectedObjectChildren = useSelector(selectors.selectSelectedObjectChildren);
  const dispatch = useDispatch();

  return (
    <div className="page multiverse">
      <h2>{ meta.name }</h2>
      <Graph />
      <div>
        <ChildrenViewer title="Inventory" objects={[]} />
        <ChildrenViewer
          objects={selectedObjectChildren}
          onAction={name => {
            dispatch(multiverseActions.reparent({ objectName: name, toParentName: 'player' }));
          }}
        />
        <ObjectViewer
          object={selectedNode}
          onAction={() => {
            dispatch(multiverseActions.move({
              objectName: 'player',
              toRoomName: selectedNode.toString()
            }));
          }}
        />
      </div>
    </div>
  );
};

export default Multiverse;
