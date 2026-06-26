import type {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { TokensService } from '../services/tokens.service';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const tokens = inject(TokensService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.url.includes('/auth/login')) {
        return throwError(() => error);
      }

      if (req.url.includes('/auth/refresh')) {
        if (error.status === 401) {
          auth.logout();
        }

        return throwError(() => error);
      }

      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (!tokens.refreshToken()) {
        auth.logout();
        return throwError(() => error);
      }

      return auth.refresh().pipe(
        switchMap(() => {
          const newToken = tokens.accessToken();

          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` },
          });

          return next(retryReq);
        }),

        catchError(() => {
          auth.logout();
          return throwError(() => error);
        }),
      );
    }),
  );
};
