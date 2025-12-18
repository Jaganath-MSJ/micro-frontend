/// <reference types="vite/client" />

declare module "remote-app-1/Button" {
  const Button: React.ComponentType<{
    label: string;
    onClick: () => void;
  }>;
  export default Button;
}

declare module "remote-app-1/*" {
  const value: unknown;
  export default value;
}

declare module "remote-app-2/Cart" {
  const Cart: React.ComponentType;
  export default Cart;
}

declare module "shared-utils/utils" {
  const utils: unknown;
  export default utils;
}
