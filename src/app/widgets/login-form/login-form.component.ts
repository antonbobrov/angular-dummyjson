import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, throwError } from 'rxjs';

import { AuthService } from '@/app/features/auth';
import { ErrorMessageComponent } from '@/app/shared/ui/error-message/error-message.component';
import { handleError } from '@/app/shared/utils';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  imports: [
    ErrorMessageComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class LoginFormComponent {
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  username = new FormControl('emilys');

  password = new FormControl('emilyspass');

  isLoading = signal(false);

  error = signal<null | string>(null);

  submit(evt: SubmitEvent) {
    evt.preventDefault();

    const username = this.username.value;
    const password = this.password.value;

    if (!username || !password) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.auth
      .login(username, password)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
        catchError((err) => {
          this.error.set(handleError(err));
          return throwError(() => err);
        }),
      )
      .subscribe();
  }
}
