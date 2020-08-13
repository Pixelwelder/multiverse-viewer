import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import multiverseReducer from '../features/multiverse/multiverseSlice';
import logReducer from '../features/log/logSlice';
import startupReducer from './startupSlice';
import uiReducer from '../features/multiverse/uiSlice';

export default configureStore({
  reducer: {
    startup: startupReducer,
    multiverse: multiverseReducer,
    log: logReducer,
    ui: uiReducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  })
});
