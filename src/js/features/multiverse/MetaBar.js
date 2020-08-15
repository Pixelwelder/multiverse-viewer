import React from 'react'
import Log from "../log/Log";
import { useDispatch, useSelector } from "react-redux";
import { selectors as logSelectors } from "../log/logSlice";
import ChildrenViewer from "./ChildrenViewer";
import { actions as multiverseActions, selectors as multiverseSelectors } from "./multiverseSlice2";
import ObjectViewer from "./ObjectViewer";
import { selectors } from "./selectors";

const MetaBar = () => {
  const { messages } = useSelector(logSelectors.select);
  const inventory = useSelector(multiverseSelectors.selectPlayerChildren);
  const selectedObjectChildren = useSelector(selectors.selectSelectedObjectChildren);
  const dispatch = useDispatch();

  return (
    <div className="meta-bar">
      <h3>MetaBar</h3>
      <Log messages={messages} />
      <ChildrenViewer title="Inventory" objects={inventory} />
      <ChildrenViewer
        objects={selectedObjectChildren}
        onAction={object => {
          dispatch(multiverseActions.reparent({ object, newParentName: 'player' }));
        }}
      />
    </div>
  );
};

export default MetaBar;
