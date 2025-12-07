import { configureStore, combineSlices } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

// Create a root reducer using combineSlices and add the user slice
const rootReducer = combineSlices(userSlice);

// Initialize store with the root reducer
const store = configureStore({
  reducer: rootReducer,
});

export default store;
