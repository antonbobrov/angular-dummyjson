import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TodosService } from '@/app/features/todos';
import { ErrorMessageComponent } from '@/app/shared/ui/error-message/error-message.component';
import { handleError } from '@/app/shared/utils';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
  imports: [
    ErrorMessageComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class AddTodoComponent {
  private todos = inject(TodosService);
  private destroyRef = inject(DestroyRef);

  readonly maxTodoLength = 200;

  todo = new FormControl('', { nonNullable: true });

  submitted = signal(false);

  error = signal<string | null>(null);

  isLoading = signal(false);

  private validate() {
    const trimmed = this.todo.value.trim();
    this.todo.setValue(trimmed, { emitEvent: false });

    if (!trimmed) {
      this.todo.setErrors({ required: true });
      this.todo.markAsTouched();
      return false;
    }

    if (trimmed.length > this.maxTodoLength) {
      this.todo.setErrors({ maxlength: true });
      this.todo.markAsTouched();
      return false;
    }

    this.todo.setErrors(null);

    return trimmed;
  }

  submit(evt: SubmitEvent) {
    evt.preventDefault();

    this.submitted.set(true);

    const value = this.validate();
    if (!value) {
      return;
    }

    this.error.set(null);
    this.isLoading.set(true);

    this.todos
      .addTodo(value)
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitted.set(false);
          this.todo.setValue('');
          this.error.set(null);
          this.isLoading.set(false);

          this.todo.setErrors(null);
          this.todo.markAsUntouched();
        },
        error: (err) => {
          this.error.set(handleError(err));
          this.isLoading.set(false);
          this.submitted.set(false);
        },
      });
  }
}
