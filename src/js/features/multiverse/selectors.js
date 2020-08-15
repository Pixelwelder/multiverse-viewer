import { createSelector } from "@reduxjs/toolkit";

import { selectors as uiSelectors } from "./uiSlice";
import { selectors as multiverseSelectors } from "./multiverseSlice2";

const selectSelectedObject = createSelector(
  multiverseSelectors.select,
  uiSelectors.select,
  ({ objects }, { selectedNode }) => {
    return objects[selectedNode];
  }
);
const selectSelectedObjectChildren = createSelector(
  multiverseSelectors.select,
  uiSelectors.select,
  ({ objects, hierarchy }, { selectedNode }) => {
    const names = hierarchy[selectedNode] || [];
    return names.map(name => objects[name]);
  }
)

const selectors = { selectSelectedObject, selectSelectedObjectChildren };
export { selectors };
