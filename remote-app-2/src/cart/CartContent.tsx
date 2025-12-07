import { useSelector, useDispatch } from "react-redux";
import { addToCart, type CartState } from "../store/cartSlice";

interface RootState {
  user?: { count: number };
  cart: CartState;
}

function CartContent() {
  const count = useSelector((state: RootState) => state.user?.count);
  const { items = [], total = 0 } = useSelector((state: RootState) => state?.cart ?? {});
  const dispatch = useDispatch();

  const handleAddItem = () => {
    dispatch(addToCart({ id: new Date(Date.now()).toISOString(), name: `Product-${items.length + 1}`, price: Math.floor(Math.random() * 100) }));
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>Total: ${total}</p>
      <button onClick={handleAddItem}>Add Item</button>
      {items.map((item) => (
        <div key={item.id}>
          {item.name} - ${item.price}
        </div>
      ))}

      <p>Inside Count: {count}</p>
    </div>
  );
};

export default CartContent;
