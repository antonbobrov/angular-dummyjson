import type { Routes } from '@angular/router';

import { ROUTE_PATHS } from '@/app/config/routes';

import { authGuard, guestGuard } from './features/auth/guards';

export const ROUTES: Routes = [
  {
    path: ROUTE_PATHS.login,
    loadComponent: () =>
      import('@/app/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
    canActivate: [guestGuard],
  },

  {
    path: ROUTE_PATHS.home,
    loadComponent: () =>
      import('@/app/layouts/authenticated-layout/authenticated-layout.component').then(
        (m) => m.AuthenticatedLayoutComponent,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: ROUTE_PATHS.home,
        loadComponent: () =>
          import('@/app/pages/home-page/home-page.component').then(
            (m) => m.HomePageComponent,
          ),
      },

      {
        path: ROUTE_PATHS.todos,
        loadComponent: () =>
          import('@/app/pages/todos-page/todos-page.component').then(
            (m) => m.TodosPageComponent,
          ),
      },
    ],
  },

  { path: ROUTE_PATHS.wildcard, redirectTo: ROUTE_PATHS.home },
];
