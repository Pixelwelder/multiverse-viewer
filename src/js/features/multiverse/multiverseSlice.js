import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { parse, createWorld } from '../../multiverse';

import { actions as logActions, createLog } from "../log/logSlice";
import worldJSON from './testWorld.json';
import { ERROR } from "../log/logTypes";

const initialState = {
  world: createWorld()
};

const init = createAsyncThunk(
  'init',
  async (_, { dispatch }) => {
    dispatch(logActions.log(createLog('Creating world...')));
    const world = parse(worldJSON);
    return world;
  }
);

const move = createAsyncThunk(
  'move',
  async ({ objectName, toRoomName }, { dispatch, getState }) => {
    try {
      const state = getState();
      const { world } = select(state);
      world.move(objectName, toRoomName);
    } catch (error) {
      dispatch(logActions.log(createLog(error, ERROR)));
      throw error;
    }
  }
);

const { reducer } = createSlice({
  name: 'multiverse',
  initialState,
  extraReducers: {
    [init.rejected]: (state, action) =>{
      console.error(action.error);
    },
    [init.fulfilled]: (state, action) => {
      state.world = action.payload;
    }
  }
});

const getNodes = (world) => {
  const nodes = world.getNodes();
  const currentNode = world.getParent('player');
  const convertedNodes = Object.entries(nodes).map(([name, node]) => ({
    id: name,
    label: node.displayName,
    title: node.displayName
  }));

  return convertedNodes;
};

const select = ({ multiverse }) => multiverse;
const selectAsGraph = createSelector(
  select,
  ({ world }) => {
    return {
      nodes: getNodes(world),
      nodesMap: world.getNodes(),
      edges: world.getEdges()
    };
  }
);
const selectPlayer = createSelector(
  select,
  ({ world }) => {
    const player = world.hasObject('player') ? world.getObject('player') : null;
    return player;
  }
);
const selectPlayerRoom = createSelector(
  select, selectPlayer,
  ({ world }, player) => {
    return world.getParent(player);
  }
);

const selectors = {
  selectAsGraph, selectPlayer
};

const actions = { init, move };

export { actions, selectors };
export default reducer;
