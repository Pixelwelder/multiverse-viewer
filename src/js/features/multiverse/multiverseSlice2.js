import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";

const initialState = {};

const slice = createSlice({
  name: 'multiverse',
  initialState,
  reducers: {},
  extraReducers: {}
});

const actions = { ...slice.actions };

const select = ({ multiverse }) => multiverse;
const selectPlayer = createSelector(select, () => null);
const selectAsGraph = createSelector(select, () => ({
  nodes: [],
  edges: []
}));
const selectors = {
  select, selectPlayer, selectAsGraph
};

export { actions, selectors };
export default slice.reducer;
