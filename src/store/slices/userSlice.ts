import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserState } from "../../types/user";

const initialState: UserState = {
    uid: "",
    displayName: "",
    firstName: "",
    lastName: "",
    email: "",
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.uid = action.payload.uid;
            state.displayName = action.payload.displayName;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.isLoggedIn = true;
        },
        clearUser: (state) => {
            state.uid = "";
            state.displayName = "";
            state.firstName = "";
            state.lastName = "";
            state.email = "";
            state.isLoggedIn = false;
        },
    },
});


export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;