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
  setup: {}  // locations keyed by item name
};

const init = createAsyncThunk(
  'init',
  async (_, { dispatch }) => {
    try {
      dispatch(logActions.log(createLog('Parsing world from JSON...')));
      let { meta, objects, graph, setup } = json;

      dispatch(logActions.log(createLog(`Creating ${objects.length} objects...`)));
      objects = objects.reduce((accum, { type, overrides }) => {
        const object = createObject(type, overrides);
        return {
          ...accum,
          [object._name]: object
        };
      }, {});
      dispatch(logActions.log(createLog(`Created objects.`)));

      dispatch(logActions.log(createLog('Successfully parsed world.')));
      return { meta, objects, graph, setup };
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
      const { meta, objects, graph, setup } = action.payload;
      state.meta = meta;
      state.objects = objects;
      state.graph = graph;
      state.setup = setup;
    }
  }
});

const actions = { ...slice.actions, init };

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
const selectPlayer = createSelector(select, () => null);
const selectors = {
  select,
  selectMeta,
  selectAsGraph,
  selectPlayer
};

export { actions, selectors };
export default slice.reducer;
