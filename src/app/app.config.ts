import type { ApplicationConfig } from '@angular/core';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import {
  AuthService,
  authInterceptor,
  refreshInterceptor,
} from '@/app/features/auth';

import { ROUTES } from './app.routes';

function initializeAuth() {
  const auth = inject(AuthService);

  return () => firstValueFrom(auth.restore());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor, refreshInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initializeAuth,
    },
    provideRouter(ROUTES),
  ],
};
