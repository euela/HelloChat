import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  current_user: null,
  users:null,
  userFind:null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
     state.current_user = action.payload
    },
    setUsers:(state,action) => {
      state.users = action.payload
    },
    setUserFind:(state,action)=>{
      state.userFind = action.payload
    }
  },
});

export const { setUser,setUsers,setUserFind} = userSlice.actions;

export default userSlice.reducer;
