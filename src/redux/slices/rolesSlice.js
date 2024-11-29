import {createSlice} from '@reduxjs/toolkit';

const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
  },
  reducers: {
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    clearRoles: state => {
      state.roles = [];
    },
  },
});

export const {setRoles, clearRoles} = rolesSlice.actions;

export default rolesSlice.reducer;
