import type { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { TokensService } from '../services/tokens.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokensService);
  const accessToken = tokens.accessToken();

  if (!accessToken) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return next(authReq);
};
