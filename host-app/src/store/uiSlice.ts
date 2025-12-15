import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  theme: "light" | "dark";
  isSidebarOpen: boolean;
}

const initialState: UiState = {
  theme: "light",
  isSidebarOpen: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setTheme: (state, action: { payload: "light" | "dark" }) => {
      state.theme = action.payload;
    },
    setSidebarOpen: (state, action: { payload: boolean }) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { toggleTheme, toggleSidebar, setTheme, setSidebarOpen } =
  uiSlice.actions;
export default uiSlice;
