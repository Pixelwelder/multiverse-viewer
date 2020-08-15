import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { actions as logActions, createLog } from "../features/log/logSlice";
import { actions as multiverseActions } from "../features/multiverse/multiverseSlice2";

const initialState = {
  isInitialized: false,
  isLoading: false
};

const startup = createAsyncThunk(
  'startup',
  async (_, { dispatch }) => {
    try {
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
    [startup.pending]: (state) => {
      state.isInitialized = false;
      state.isLoading = true;
    },
    [startup.rejected]: (state, action) => {
      state.isLoading = false;
      console.log(action.error);
    },
    [startup.fulfilled]: (state) => {
      state.isLoading = false;
    }
  }
});

const actions = { startup };

export { actions };
export default reducer;