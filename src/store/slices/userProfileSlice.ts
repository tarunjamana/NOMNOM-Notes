import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../../types/user";

interface UserProfileState {
    profile: UserProfile | null;
    isLoaded: boolean;
  }
  
  const initialState: UserProfileState = {
    profile: null,
    isLoaded: false,
  };
  
  const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
      setUserProfile: (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.isLoaded = true;
      },
      updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
        if (!state.profile) return;
        Object.assign(state.profile, action.payload);
      },
      clearUserProfile: (state) => {
        state.profile = null;
        state.isLoaded = false;
      },
    },
  });
  

export const { setUserProfile, updateUserProfile, clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
