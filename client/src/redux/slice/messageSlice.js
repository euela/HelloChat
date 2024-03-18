import {createSlice } from '@reduxjs/toolkit';

const initialState = {
message:null,
fetchMessage:false
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage:(state,action)=>{
        state.message = [...action.payload]
    },
    setFetchMessage:(state,action)=>{
        state.fetchMessage = action.payload
    }
  },
});

export const { setMessage,setFetchMessage} = messageSlice.actions;

export default messageSlice.reducer;
