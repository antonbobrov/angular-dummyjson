import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { DeleteTodoComponent } from '../delete-todo/delete-todo.component';
import { ResolveTodoComponent } from '../resolve-todo/resolve-todo.component';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  imports: [MatListModule, DeleteTodoComponent, ResolveTodoComponent],
})
export class TodoItemComponent {
  readonly id = input(0);

  readonly text = input('');

  readonly completed = input(false);
}
