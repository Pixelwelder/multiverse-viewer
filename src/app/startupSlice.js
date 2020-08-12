import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { actions as logActions, createLog } from "../features/log/logSlice";
import { actions as multiverseActions } from "../features/multiverse/multiverseSlice";

const initialState = {
  isInitialized: false,
  isLoading: false
};

const init = createAsyncThunk(
  'init',
  async (_, { dispatch }) => {
    try {
      console.log('go');
      dispatch(logActions.log(createLog('Starting up...')));
      await dispatch(multiverseActions.init());
      dispatch(logActions.log(createLog('Startup complete')));
    } catch (error) {
      dispatch(logActions.log(createLog(error.message)));
      throw error;
    }
  }
);

const { reducer } = createSlice({
  name: 'startup',
  initialState,
  extraReducers: {
    [init.pending]: (state) => {
      state.isInitialized = false;
      state.isLoading = true;
    },
    [init.rejected]: (state) => {
      state.isLoading = false;
    },
    [init.fulfilled]: (state) => {
      state.isLoading = false;
    }
  }
});

const actions = { init };

export { actions };
export default reducer;