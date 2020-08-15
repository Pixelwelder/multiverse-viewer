import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { selectors as multiverseSelectors } from "./multiverseSlice2";
import { actions as logActions, createLog } from "../log/logSlice";
import { ERROR } from "../log/logTypes";

const initialState = {
  selectedNode: null
};

const initUI = createAsyncThunk(
  'initUI',
  async (_, { dispatch, getState }) => {
    try {
      dispatch(logActions.log(createLog('Initializing UI...')));
      const { start } = multiverseSelectors.selectMeta(getState());
      dispatch(logActions.log(createLog('UI Initialized')));
      return { selectedNode: start };
    } catch (error) {
      dispatch(logActions.log(createLog(error, ERROR)));
      throw error;
    }
  }
);

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    }
  },
  extraReducers: {
    [initUI.fulfilled]: (state, action) => {
      state.selectedNode = action.payload.selectedNode;
    }
  }
});

const select = ({ ui }) => ui;
const selectors = { select };
const actions = { ...slice.actions, initUI };

export { selectors, actions };
export default slice.reducer;