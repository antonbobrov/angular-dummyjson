import { Component } from '@angular/core';

import { AddTodoComponent } from '@/app/widgets/add-todo/add-todo.component';
import { TodosListComponent } from '@/app/widgets/todos-list/todos-list.component';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.scss',
  imports: [TodosListComponent, AddTodoComponent],
})
export class TodosPageComponent {}
