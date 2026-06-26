import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';

import { apiUrl } from '@/app/shared/api/config';

import { AuthService } from '../../auth';

import type { TTodoDelete, TTodoItem, TTodos } from '../types';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private auth = inject(AuthService);
  private http = inject(HttpClient);

  readonly list = signal<TTodoItem[]>([]);

  getTodosByUserId(id: number) {
    return this.http.get<TTodos>(apiUrl(`/todos/user/${id}`)).pipe(
      tap(({ todos }) => {
        this.list.set(todos);
      }),
    );
  }

  addTodo(todo: string) {
    const userId = this.auth.id();

    if (!userId) {
      return null;
    }

    return this.http
      .post<TTodoItem>(apiUrl(`/todos/add`), {
        todo,
        completed: false,
        userId: this.auth.id(),
      })
      .pipe(
        tap((item) => {
          this.list.update((prev) => [item, ...prev]);
        }),
      );
  }

  deleteTodo(id: number) {
    return this.http.delete<TTodoDelete>(apiUrl(`/todos/${id}`)).pipe(
      switchMap((res) => {
        if (!res.isDeleted) {
          return throwError(() => new Error('Cannot delete the item'));
        }

        this.list.update((prev) => prev.filter((item) => item.id !== id));

        return of(res);
      }),

      catchError((err) => {
        if ('status' in err && err.status === 404) {
          this.list.update((prev) => prev.filter((item) => item.id !== id));
        }

        return throwError(() => err);
      }),
    );
  }

  resolveTodo(id: number, completed: boolean) {
    return this.http.put<TTodoItem>(apiUrl(`/todos/${id}`), { completed }).pipe(
      tap((res) => {
        this.list.update((prev) => {
          return prev.map((item) => {
            if (item.id === id) {
              return res;
            }

            return item;
          });
        });
      }),
    );
  }

  clear() {
    this.list.set([]);
  }
}
