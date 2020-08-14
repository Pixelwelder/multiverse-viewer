import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedNode: null
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    }
  }
});

const select = ({ ui }) => ui;
const selectors = { select };
const actions = { ...slice.actions };

export { selectors, actions };
export default slice.reducer;