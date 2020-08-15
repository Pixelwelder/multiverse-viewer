import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { actions as logActions, createLog } from "../log/logSlice";
import { ERROR } from "../log/logTypes";
import { ROOM } from "./objectTypes";
import { createObject } from "./createObject";

const json = require('./testWorld.json');

const initialState = {
  meta: {
    name: 'New World',
    description: 'This is a brand new world.'
  },
  objects: {},
  graph: {}, // arrays of destination names keyed by the name of their starts
  hierarchy: {},
  invertedHierarchy: {}
};

const init = createAsyncThunk(
  'init',
  async (_, { dispatch }) => {
    try {
      dispatch(logActions.log(createLog('Parsing world from JSON...')));
      let { meta, objects, graph, hierarchy } = json;

      dispatch(logActions.log(createLog(`Creating ${objects.length} objects...`)));
      objects = objects.reduce((accum, { type, overrides }) => {
        const object = createObject(type, overrides);
        return {
          ...accum,
          [object._name]: object
        };
      }, {});
      dispatch(logActions.log(createLog(`Created objects.`)));

      dispatch(logActions.log(createLog('Parsing hierarchy...')));
      const invertedHierarchy = {};
      Object.entries(hierarchy).forEach(([parent, children]) => {
        children.forEach(child => {
          invertedHierarchy[child] = parent;
        });
      });
      dispatch(logActions.log(createLog('Hierarchy complete.')));

      dispatch(logActions.log(createLog('Successfully parsed world.')));
      return { meta, objects, graph, hierarchy, invertedHierarchy };
    } catch (error) {
      dispatch(logActions.log(createLog(error, ERROR)));
      throw error;
    }
  }
);

const reparent = createAsyncThunk(
  'reparent',
  async ({ object, newParentName }, { dispatch, getState }) => {
    try {
      const { hierarchy, invertedHierarchy } = select(getState());
      const oldParentName = invertedHierarchy[object];
      const oldParentChildren = hierarchy[oldParentName] || [];
      const newParentChildren = hierarchy[newParentName] || [];
      const oldParentFilteredChildren = oldParentChildren.filter(name => name !== object.toString());

      return {
        object, oldParentName, newParentName,
        oldParentChildren: oldParentChildren.filter(name => name !== object.toString()),
        newParentChildren: [...newParentChildren, object.toString()]
      };

    } catch (error) {
      dispatch(logActions.log(createLog(error, ERROR)));
      throw error;
    }
  }
);

const slice = createSlice({
  name: 'multiverse',
  initialState,
  reducers: {},
  extraReducers: {
    [init.fulfilled]: (state, action) => {
      const { meta, objects, graph, hierarchy, invertedHierarchy } = action.payload;
      state.meta = meta;
      state.objects = objects;
      state.graph = graph;
      state.hierarchy = hierarchy;
      state.invertedHierarchy = invertedHierarchy;
    },
    [reparent.fulfilled]: (state, action) => {
      const { object, oldParentName, newParentName, oldParentChildren, newParentChildren } = action.payload;

      state.hierarchy[oldParentName] = oldParentChildren;
      state.hierarchy[newParentName] = newParentChildren
      state.invertedHierarchy[object] = newParentName;
    }
  }
});

const actions = { ...slice.actions, init, reparent };

const select = ({ multiverse }) => multiverse;
const selectMeta = createSelector(select, ({ meta }) => meta);
const selectNodes = createSelector(select, ({ objects }) => {
  return Object.values(objects)
    .filter(({ _type }) => _type === ROOM)
    .map(object => ({
      id: object._name, label: object.displayName, title: object.displayName, object
    }));
});
const selectEdges = createSelector(select, ({ graph }) => {
  const edges = [];
  Object.entries(graph).forEach(([start, ends]) => {
    ends.forEach(end => {
      edges.push({ from: start, to: end, id: `${start}->${end}` });
    });
  });
  return edges;
});
const selectAsGraph = createSelector(
  selectNodes, selectEdges,
  (nodes, edges) => ({ nodes, edges })
);
const selectPlayer = createSelector(select, ({ objects }) => objects['player']);
const selectPlayerChildren = createSelector(
  select,
  ({ objects, hierarchy }) => {
    const names = hierarchy['player'] || [];
    return names.map(name => objects[name]);
  }
);
const selectors = {
  select,
  selectMeta,
  selectAsGraph,
  selectPlayer,
  selectPlayerChildren
};

export { actions, selectors };
export default slice.reducer;
