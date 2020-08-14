import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { parse, createWorld } from '../../multiverse';

import { actions as logActions, createLog } from "../log/logSlice";
import worldJSON from './testWorld.json';

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
  const convertedNodes = Object.entries(nodes).map(([name, node]) => ({
    id: name,
    label: node.displayName,
    title: node.displayName
  }));

  return convertedNodes;
};

const select = ({ multiverse }) => multiverse;
const selectors = {
  selectAsGraph: createSelector(
    select,
    ({ world }) => {
      return {
        nodes: getNodes(world),
        nodesMap: world.getNodes(),
        edges: world.getEdges()
      };
    }
  ),
  selectPlayer: createSelector(
    select,
    ({ world }) => {
      const player = world.hasObject('player') ? world.getObject('player') : null;
      console.log('player', typeof player);
      return player;
    }
  )
};

const actions = { init };

export { actions, selectors };
export default reducer;
