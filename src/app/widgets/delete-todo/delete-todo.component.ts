import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TodosService } from '@/app/features/todos';
import { handleError } from '@/app/shared/utils';

@Component({
  selector: 'app-delete-todo',
  templateUrl: './delete-todo.component.html',
  styleUrl: './delete-todo.component.scss',
  imports: [MatButtonModule, MatProgressSpinnerModule, MatIconModule],
})
export class DeleteTodoComponent {
  private todos = inject(TodosService);
  private destroyRef = inject(DestroyRef);

  id = input(0);

  error = signal<string | null>(null);

  isLoading = signal(false);

  delete() {
    this.error.set(null);
    this.isLoading.set(true);

    this.todos
      .deleteTodo(this.id())
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
