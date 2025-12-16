import { lazy, Suspense } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { incrementCount } from "./store/userSlice";

const Remote1Button = lazy(() => import("remote-app-1/Button"));
const Remote2Cart = lazy(() => import("remote-app-2/Cart"));

const loadSharedUtils = async () => {
  const utils = await import("sharedUtils/utils");
  return utils;
};

function App() {
  const dispatch = useDispatch();

  const onCheckUtils = async () => {
    const data = await loadSharedUtils();
    console.log(data);
  };

  return (
    <div>
      <button onClick={onCheckUtils}>Check Shared Utils</button>

      <h1>Host Application</h1>

      <Suspense fallback={<div>Loading remote 1 button component...</div>}>
        <Remote1Button
          label={`Click from Remote`}
          onClick={() => dispatch(incrementCount())}
        />
      </Suspense>

      <Suspense fallback={<div>Loading remote 2 cart component...</div>}>
        <Remote2Cart />
      </Suspense>
    </div>
  );
}

export default App;
