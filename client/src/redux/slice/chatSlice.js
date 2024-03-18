import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats:null,
  selectedChat:null,
  fetch:false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
      setChats:(state,action)=>{
        state.chats = action.payload
      },
      setSelectedChat:(state,action)=>{
        state.selectedChat = action.payload  
      },
      setFetch:(state,action)=>{
        state.fetch = action.payload
      }
  },
});

export const { setChats,setSelectedChat,setFetch} = chatSlice.actions;

export default chatSlice.reducer;
