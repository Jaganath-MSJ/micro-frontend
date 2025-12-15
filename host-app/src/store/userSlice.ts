import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    isAuthenticated: false,
    count: 0,
  },
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.name = "";
      state.isAuthenticated = false;
    },
    incrementCount: (state) => {
      state.count += 1;
    },
  },
});

export const { setUser, logout, incrementCount } = userSlice.actions;
export default userSlice;
