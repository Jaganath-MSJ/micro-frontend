import { useSelector } from "react-redux";
import CartContent from "./CartContent";

interface RootState {
  user?: {
    count: number;
  };
}

const loadSharedUtils = async () => {
  const utils = await import("shared-utils/utils");
  return utils;
};

function Cart() {
  const count = useSelector((state: RootState) => state?.user?.count ?? 0);
  // throw new Error("Intentional test error in Cart component");

  const onCheckUtils = async () => {
    const data = (await loadSharedUtils()).getUserMessage();
    console.log("haiiia aa", data);
  };

  return (
    <>
      {/* <Activity mode={(count % 3) !== 0 ? 'visible' : 'hidden'}>
        <CartContent />
      </Activity> */}
      {count % 3 !== 0 && <CartContent />}
      <p>Outside Count: {count}</p>
      <button onClick={onCheckUtils}>Check Shared Utils in Remote 2</button>
    </>
  );
}

export default Cart;
