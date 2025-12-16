import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";

export function useAppDispatch() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = useStore();
  return useDispatch<typeof store.dispatch>();
}

export function useAppSelector() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = useStore();
  // Note: This will likely be 'any' or generic Store state if store.ts is commented out
  // but it's the best we can do dynamically without a concrete RootState type.
  type RootState = ReturnType<typeof store.getState>;
  return useSelector as TypedUseSelectorHook<RootState>;
}
