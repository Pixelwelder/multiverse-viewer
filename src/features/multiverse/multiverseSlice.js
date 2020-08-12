import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { parse } from '@pixelwelders/multiverse';

import { actions as logActions, createLog } from "../log/logSlice";
import worldJSON from './testWorld.json';

const initialState = {
  world: {}
};

const init = createAsyncThunk(
  'init',
  async (_, { dispatch }) => {
    dispatch(logActions.log(createLog('Creating world...')));
    const world = parse(worldJSON);
  }
);

const { reducer } = createSlice({
  name: 'multiverse',
  initialState,
  reducers: {}
});

const select = ({ multiverse }) => multiverse;
const selectors = {
  selectAsGraph: createSelector(
    select,
    ({ world }) => ({
      nodes: world.getNodes(),
      edges: world.getEdges()
    })
  )
};

const actions = { init };

export { actions, selectors };
export default reducer;
