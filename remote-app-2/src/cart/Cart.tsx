import { Provider, useSelector } from "react-redux";
import CartContent from "./CartContent";
import { store } from "../store/store";

interface RootState {
  user?: {
    count: number;
  };
}

function Cart() {
  const count = useSelector((state: RootState) => state?.user?.count ?? 0);
  return (
    <>
      {/* <Activity mode={(count % 3) !== 0 ? 'visible' : 'hidden'}>
        <CartContent />
      </Activity> */}
      <Provider store={store}>
        {(count % 3) !== 0 && <CartContent />}
      </Provider>
      <p>Outside Count: {count}</p>
    </>
  );
};

export default Cart;
