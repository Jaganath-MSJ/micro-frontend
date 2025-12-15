import { configureStore, combineSlices, type Reducer } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import uiSlice from "./uiSlice";

// Create a root reducer using combineSlices and add the user slice
const rootReducer = combineSlices(userSlice, uiSlice);

// Initialize store with the root reducer
const store = configureStore({
  reducer: rootReducer,
});

export type AppStore = typeof store & {
  injectReducer: (key: string, asyncReducer: Reducer) => void;
  ejectReducer: (key: string) => void;
};

export type RootState = ReturnType<typeof rootReducer>;

// Function to inject new reducers dynamically
// combineSlices returns a reducer that has an .inject() method
(store as AppStore).injectReducer = function injectReducer(
  key: string,
  asyncReducer: Reducer
) {
  // combineSlices.inject() automatically handles duplicates and returns the injected slice/reducer
  rootReducer.inject({ reducerPath: key, reducer: asyncReducer });
  store.dispatch({ type: `@reducer/injected/${key}` });
  console.log(`Reducer '${key}' injected successfully`);
};

// Function to eject previously injected reducers
// (store as AppStore).ejectReducer = function ejectReducer(key: string) {
//   // combineSlices does not support ejecting reducers at runtime in the same way
//   // We'll log a warning as per the plan
//   console.warn(`Reducer '${key}' cannot be ejected when using combineSlices. This operation is a no-op.`);
// };

export default store;
