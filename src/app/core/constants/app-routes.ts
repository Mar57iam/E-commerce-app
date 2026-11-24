export const APP_ROUTE_PATHS = {
  home: 'home',
  shop: 'shop',
  categories: 'categories',
  brands: 'brands',
  productDetails: 'details/:id/:slug',
  productDetailsById: 'details/:id',
  cart: 'cart',
  checkout: 'checkout/:id',
  wishlist: 'wishlist',
  orders: 'allorders',
  login: 'login',
  register: 'register',
  forgotPassword: 'forgetpassword',
  notFound: '**',
} as const;

export const APP_ROUTE_LINKS = {
  home: `/${APP_ROUTE_PATHS.home}`,
  shop: `/${APP_ROUTE_PATHS.shop}`,
  categories: `/${APP_ROUTE_PATHS.categories}`,
  brands: `/${APP_ROUTE_PATHS.brands}`,
  productDetails: (id: string | number, slug: string) =>
    `/${APP_ROUTE_PATHS.productDetails
      .replace(':id', encodeURIComponent(String(id)))
      .replace(':slug', encodeURIComponent(slug))}`,
  cart: `/${APP_ROUTE_PATHS.cart}`,
  checkout: (id: string) =>
    `/${APP_ROUTE_PATHS.checkout.replace(':id', encodeURIComponent(id))}`,
  wishlist: `/${APP_ROUTE_PATHS.wishlist}`,
  orders: `/${APP_ROUTE_PATHS.orders}`,
  login: `/${APP_ROUTE_PATHS.login}`,
  register: `/${APP_ROUTE_PATHS.register}`,
  forgotPassword: `/${APP_ROUTE_PATHS.forgotPassword}`,
} as const;
