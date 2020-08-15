import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { actions as logActions, createLog } from "../log/logSlice";
import { ERROR } from "../log/logTypes";
import { ROOM } from "./objectTypes";
import { createObject } from "./createObject";

const json = require('./testWorld2.json');

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
  'initMultiverse',
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

/**
 * Works its way up through the hierarchy until it finds a room.
 * @param objectName - the item to start with.
 */
const getRoom = (objectName, invertedHierarchy, objects) => {
  let current = objectName;
  while (true) {
    if (!invertedHierarchy[current]) break;
    current = invertedHierarchy[current];
  }

  const object = objects[current];
  if (!object) return undefined;
  if (!object._type === ROOM) return undefined;

  return object;
}

const reparent = createAsyncThunk(
  'reparent',
  async ({ object: _object, newParentName }, { dispatch, getState }) => {
    try {
      const state = getState();
      const { objects, graph, hierarchy, invertedHierarchy } = select(state);
      const object = _object || selectPlayer(state);
      const oldParentName = invertedHierarchy[object];

      // Certain moves have rules.
      const oldParent = objects[oldParentName];
      const newParent = objects[newParentName];
      if (oldParent._type === ROOM && newParent._type === ROOM) {
        dispatch(logActions.log(createLog('Attempting to move between rooms.')));
        if (!(graph[oldParent] && graph[oldParent].find(({ to }) => to === newParent.toString()))) {
          throw new Error(`${newParent} is inaccessible from ${oldParent}.`);
        }
      } else {
        // Objects must share a room to move.
        const oldRoom = getRoom(oldParentName, invertedHierarchy, objects);
        const newRoom = getRoom(newParentName, invertedHierarchy, objects);
        if (oldRoom !== newRoom) throw new Error('Cannot pick up an object in another location.');
      }

      const oldParentChildren = hierarchy[oldParentName] || [];
      const newParentChildren = hierarchy[newParentName] || [];

      dispatch(logActions.log(createLog(`Moved ${object} from ${oldParent} to ${newParent}.`)));
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
// const selectFilteredNodes = createSelector(
//   select, selectNodes,
//   ({ objects, graph, invertedHierarchy }, nodes) => {
//     const playerRoom = getRoom('player', invertedHierarchy, objects);
//     if (!playerRoom) return nodes;
//
//     const accessibleRooms = graph[playerRoom].reduce((accum, name) => ({ ...accum, [name]: true }), {});
//     return nodes.filter((node) => accessibleRooms[node.id]);
//   }
// );
const selectEdges = createSelector(select, ({ graph }) => {
  const edges = [];
  Object.entries(graph).forEach(([start, ends]) => {
    ends.forEach(end => {
      edges.push({ from: start, to: end.to, id: `${start}->${end.to}`, name: end.name });
    });
  });
  return edges;
});
const selectAsGraph = createSelector(
  selectNodes, selectEdges,
  (nodes, edges) => ({ nodes, edges })
);
// const selectAsFilteredGraph = createSelector(
//   selectFilteredNodes, selectEdges,
//   (nodes, edges) => ({ nodes, edges })
// );
const selectPlayer = createSelector(select, ({ objects }) => objects['player']);
const selectPlayerChildren = createSelector(
  select,
  ({ objects, hierarchy }) => {
    const names = hierarchy['player'] || [];
    return names.map(name => objects[name]);
  }
);
const selectPlayerRoom = createSelector(
  select,
  ({ invertedHierarchy, objects }) => {
    return getRoom('player', invertedHierarchy, objects);
  }
);
const selectors = {
  select,
  selectMeta,
  selectAsGraph,
  selectPlayer,
  selectPlayerChildren,
  selectPlayerRoom
};

export { actions, selectors };
export default slice.reducer;
