import { lazy, Suspense } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { incrementCount } from "./store/userSlice";

const Remote1Button = lazy(() => import("remote-app-1/Button"));
const Remote2Cart = lazy(() => import("remote-app-2/Cart"));

function App() {
  const dispatch = useDispatch();

  return (
    <div>
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
