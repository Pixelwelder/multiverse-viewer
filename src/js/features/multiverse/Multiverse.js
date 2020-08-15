import React from 'react';

import './style.scss';

import Graph from "./Graph";
import ChildrenViewer from "./ChildrenViewer";
import { selectors as multiverseSelectors, actions as multiverseActions } from "./multiverseSlice2";
import { selectors } from "./selectors";
import { useDispatch, useSelector } from "react-redux";
import ObjectViewer from "./ObjectViewer";

const Multiverse = () => {
  // const { selectedNode } = useSelector(uiSelectors.select);
  const meta = useSelector(multiverseSelectors.selectMeta);
  const inventory = useSelector(multiverseSelectors.selectPlayerChildren);
  const selectedObject = useSelector(selectors.selectSelectedObject);
  const selectedObjectChildren = useSelector(selectors.selectSelectedObjectChildren);
  const playerRoom = useSelector(multiverseSelectors.selectPlayerRoom);
  const dispatch = useDispatch();

  console.log(selectedObject, playerRoom);
  return (
    <div className="page multiverse">
      <h2>{ meta.name }</h2>
      <Graph />
      <div>
        <ChildrenViewer title="Inventory" objects={inventory} />
        <ChildrenViewer
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
      </div>
    </div>
  );
};

export default Multiverse;
