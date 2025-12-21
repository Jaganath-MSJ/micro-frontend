export const ROUTES = {
  HOME: "/",
  REMOTE1: {
    ROOT: "/remote1",
    PRODUCTS: "/remote1/products",
    PRODUCT_DETAIL: (id: string) => `/remote1/products/${id}`,
  },
  REMOTE2: {
    ROOT: "/remote2",
    CART: "/remote2/cart",
    CHECKOUT: "/remote2/checkout",
  },
} as const;

export type AppRoutes = typeof ROUTES;
