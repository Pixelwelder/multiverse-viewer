import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import multiverseReducer from '../features/multiverse/multiverseSlice';
import logReducer from '../features/log/logSlice';
import startupReducer from './startupSlice';

export default configureStore({
  reducer: {
    startup: startupReducer,
    counter: counterReducer,
    multiverse: multiverseReducer,
    log: logReducer
  },
});
