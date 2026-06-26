import { inject } from '@angular/core';

import { ROUTE_URLS } from '@/app/config/routes';
import { AuthService } from '@/app/features/auth';

export class WithAuth {
  protected auth = inject(AuthService);

  protected readonly routeUrls = ROUTE_URLS;
}
