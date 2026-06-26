import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TodosService } from '@/app/features/todos';
import { handleError } from '@/app/shared/utils';

@Component({
  selector: 'app-resolve-todo',
  templateUrl: './resolve-todo.component.html',
  styleUrl: './resolve-todo.component.scss',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
  ],
})
export class ResolveTodoComponent {
  private todos = inject(TodosService);
  private destroyRef = inject(DestroyRef);

  id = input(0);

  readonly completed = input(false);

  error = signal<string | null>(null);

  isLoading = signal(false);

  toggle(checked: boolean) {
    this.error.set(null);
    this.isLoading.set(true);

    this.todos
      .resolveTodo(this.id(), checked)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.error.set(null);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(handleError(err));
          this.isLoading.set(false);
        },
      });
  }
}
