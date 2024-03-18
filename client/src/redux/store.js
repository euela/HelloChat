import { configureStore,combineReducers} from '@reduxjs/toolkit';
import userReducer from './slice/userSlice.js'
import chatReducer from './slice/chatSlice.js'
import messageReducer from './slice/messageSlice.js'

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  message:messageReducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

