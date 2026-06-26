import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  finalize,
  map,
  type Observable,
  of,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';

import { ROUTE_URLS } from '@/app/config/routes';
import { apiUrl, API } from '@/app/shared/api/config';

import {
  ACCESS_TOKEN_EXPIRES_IN_MIN,
  REFRESH_TOKEN_EXPIRES_IN_MIN,
} from '../config';

import { TokensService } from './tokens.service';

import type { TAuthLogin, TAuthMe } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokens = inject(TokensService);
  private router = inject(Router);

  private me = signal<TAuthMe | null>(null);
  private refreshInProgress: Observable<TAuthLogin> | null = null;

  isAuthenticated = computed(() =>
    Boolean(this.tokens.accessToken() && this.me()),
  );

  id = computed(() => this.me()?.id);
  firstName = computed(() => this.me()?.firstName);
  lastName = computed(() => this.me()?.lastName);

  restore() {
    if (!this.tokens.accessToken()) {
      return of(undefined);
    }

    return this.http.get<TAuthMe>(apiUrl(API.auth.me)).pipe(
      tap((res) => {
        if (!res?.id) {
          throw new Error('Invalid session');
        }

        this.me.set(res);
      }),
      catchError(() => {
        this._clear();
        return of(undefined);
      }),
      map(() => undefined),
    );
  }

  login(username: string, password: string) {
    return this.http
      .post<TAuthLogin>(apiUrl(API.auth.login), {
        username,
        password,
        expiresInMins: ACCESS_TOKEN_EXPIRES_IN_MIN,
      })
      .pipe(
        tap((res) => {
          this.tokens.setAccessToken(res.accessToken);
          this.tokens.setRefreshToken(res.refreshToken);

          this.me.set({
            firstName: res.firstName,
            lastName: res.lastName,
            id: res.id,
          });

          this.router.navigate([ROUTE_URLS.home]);
        }),

        catchError((error) => {
          this._clear();
          return throwError(() => error);
        }),
      );
  }

  refresh() {
    const refreshToken = this.tokens.refreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token found'));
    }

    if (!this.refreshInProgress) {
      this.refreshInProgress = this.http
        .post<TAuthLogin>(apiUrl(API.auth.refresh), {
          refreshToken,
          expiresInMins: REFRESH_TOKEN_EXPIRES_IN_MIN,
        })
        .pipe(
          tap((res) => {
            this.tokens.setAccessToken(res.accessToken);
            this.tokens.setRefreshToken(res.refreshToken);
          }),

          catchError((error) => {
            this.logout();
            return throwError(() => error);
          }),

          finalize(() => {
            this.refreshInProgress = null;
          }),

          shareReplay(1),
        );
    }

    return this.refreshInProgress;
  }

  logout() {
    this._clear();
    this.router.navigate([ROUTE_URLS.login]);
  }

  private _clear() {
    this.me.set(null);
    this.tokens.clear();
  }
}
