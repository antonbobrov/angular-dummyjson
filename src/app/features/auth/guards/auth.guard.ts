import type { CanActivateFn } from '@angular/router';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { ROUTE_URLS } from '@/app/config/routes';

import { AuthService } from '../services';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([ROUTE_URLS.login]);
};
