import { useSelector } from "react-redux";
import CartContent from "./CartContent";

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
      {count % 3 !== 0 && <CartContent />}
      <p>Outside Count: {count}</p>
    </>
  );
}

export default Cart;
