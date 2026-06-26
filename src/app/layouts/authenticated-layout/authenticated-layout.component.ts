import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ROUTE_URLS } from '@/app/config/routes';
import { WithAuth } from '@/app/shared/entities/WithAuth';

@Component({
  selector: 'app-authenticated-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './authenticated-layout.component.html',
  styleUrl: './authenticated-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedLayoutComponent extends WithAuth {
  protected readonly routes = ROUTE_URLS;

  firstName = this.auth.firstName;
  lastName = this.auth.lastName;

  logout() {
    this.auth.logout();
  }
}
