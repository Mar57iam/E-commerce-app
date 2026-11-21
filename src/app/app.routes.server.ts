import { RenderMode, ServerRoute } from '@angular/ssr';
import { APP_ROUTE_PATHS } from './core/constants/app-routes';

export const serverRoutes: ServerRoute[] = [
  {
    path: APP_ROUTE_PATHS.productDetails,
    renderMode: RenderMode.Server,
  },
  {
    path: APP_ROUTE_PATHS.productDetailsById,
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
