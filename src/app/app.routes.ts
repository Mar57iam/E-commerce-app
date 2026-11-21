import { Routes } from '@angular/router';
import { APP_ROUTE_PATHS } from './core/constants/app-routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: APP_ROUTE_PATHS.home,
    pathMatch: 'full',
  },
  {
    path: APP_ROUTE_PATHS.home,
    title: 'Home | FreshCart',
    loadComponent: () =>
      import('./home/home.component').then((module) => module.HomeComponent),
  },
  {
    path: APP_ROUTE_PATHS.shop,
    title: 'Shop | FreshCart',
    loadComponent: () =>
      import('./shop/shop.component').then((module) => module.ShopComponent),
  },
  {
    path: APP_ROUTE_PATHS.categories,
    title: 'Categories | FreshCart',
    loadComponent: () =>
      import('./categories/categories.component').then(
        (module) => module.CategoriesComponent,
      ),
  },
  {
    path: APP_ROUTE_PATHS.brands,
    title: 'Brands | FreshCart',
    loadComponent: () =>
      import('./brands/brands.component').then(
        (module) => module.BrandsComponent,
      ),
  },
  {
    path: APP_ROUTE_PATHS.productDetails,
    title: 'Product Details | FreshCart',
    loadComponent: () =>
      import('./details/details.component').then(
        (module) => module.DetailsComponent,
      ),
  },
  {
    path: APP_ROUTE_PATHS.productDetailsById,
    title: 'Product Details | FreshCart',
    loadComponent: () =>
      import('./details/details.component').then(
        (module) => module.DetailsComponent,
      ),
  },
  {
    path: APP_ROUTE_PATHS.cart,
    title: 'Cart | FreshCart',
    loadComponent: () =>
      import('./cart/cart.component').then((module) => module.CartComponent),
  },
  {
    path: APP_ROUTE_PATHS.checkout,
    title: 'Checkout | FreshCart',
    loadComponent: () =>
      import('./checkout/checkout.component').then(
        (module) => module.CheckoutComponent,
      ),
  },
  {
    path: APP_ROUTE_PATHS.wishlist,
    title: 'Wishlist | FreshCart',
    loadComponent: () =>
      import('./wishlist/wishlist.component').then(
        (module) => module.WishlistComponent,
      ),
  },
  {
    path: APP_ROUTE_PATHS.orders,
    title: 'Orders | FreshCart',
    loadComponent: () =>
      import('./orders/orders.component').then(
        (module) => module.OrdersComponent,
      ),
  },
  {
    path: APP_ROUTE_PATHS.login,
    title: 'Login | FreshCart',
    loadComponent: () =>
      import('./login/login.component').then((module) => module.LoginComponent),
  },
  {
    path: APP_ROUTE_PATHS.register,
    title: 'Register | FreshCart',
    loadComponent: () =>
      import('./register/register.component').then(
        (module) => module.RegisterComponent,
      ),
  },
  {
    path: APP_ROUTE_PATHS.forgotPassword,
    title: 'Forgot Password | FreshCart',
    loadComponent: () =>
      import('./forgetpassword/forgetpassword.component').then(
        (module) => module.ForgetpasswordComponent,
      ),
  },
  {
    path: APP_ROUTE_PATHS.notFound,
    title: 'Page Not Found | FreshCart',
    loadComponent: () =>
      import('./notfound/notfound.component').then(
        (module) => module.NotfoundComponent,
      ),
  },
];
