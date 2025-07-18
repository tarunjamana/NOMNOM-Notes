import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import userProfileReducer from "./slices/userProfileSlice";

export const appStore = configureStore({
  reducer: {
    user: userReducer,
    userProfile: userProfileReducer,
  },
});     

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;