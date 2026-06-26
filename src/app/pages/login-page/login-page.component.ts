import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { LoginFormComponent } from '@/app/widgets/login-form/login-form.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  imports: [LoginFormComponent, MatCardModule],
})
export class LoginPageComponent {}
