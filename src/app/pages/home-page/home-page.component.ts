import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { WithAuth } from '@/app/shared/entities/WithAuth';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  imports: [MatCardModule],
  styleUrl: 'home-page.component.scss',
})
export class HomePageComponent extends WithAuth {
  firstName = this.auth.firstName;
  lastName = this.auth.lastName;
}
