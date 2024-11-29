import {configureStore} from '@reduxjs/toolkit';
import rolesReducer from './slices/rolesSlice.js';

const store = configureStore({
  reducer: {
    roles: rolesReducer,
  },
});

export default store;
