import { lazy } from "react";
import { useDispatch } from "react-redux";
import { incrementCount } from "../../store/userSlice";

const Remote1Button = lazy(() => import("remote-app-1/Button"));
function Button() {
  const dispatch = useDispatch();
  return (
    <Remote1Button
      label={`Click from Remote`}
      onClick={() => dispatch(incrementCount())}
    />
  );
}

export default Button;
