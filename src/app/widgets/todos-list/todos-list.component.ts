import { Component, effect, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TodosService } from '@/app/features/todos';
import { WithAuth } from '@/app/shared/entities/WithAuth';
import { ErrorMessageComponent } from '@/app/shared/ui/error-message/error-message.component';
import { handleError } from '@/app/shared/utils';

import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss',
  imports: [
    ErrorMessageComponent,
    MatListModule,
    MatProgressSpinnerModule,
    TodoItemComponent,
  ],
})
export class TodosListComponent extends WithAuth {
  private todos = inject(TodosService);

  readonly list = this.todos.list;

  isLoading = signal(true);
  error = signal<null | string>(null);

  constructor() {
    super();

    effect((onCleanup) => {
      const id = this.auth.id();

      if (!id) {
        this.todos.clear();
        return;
      }

      this.error.set(null);
      this.isLoading.set(true);

      const sub = this.todos.getTodosByUserId(id).subscribe({
        next: () => {
          this.isLoading.set(false);
        },
        error: (err) => {
          this.todos.clear();
          this.error.set(handleError(err));
          this.isLoading.set(false);
        },
      });

      onCleanup(() => sub.unsubscribe());
    });
  }
}
