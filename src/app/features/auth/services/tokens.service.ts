import { Injectable, signal } from '@angular/core';

import { ACCESS_TOKEN_LS_NAME, REFRESH_TOKEN_LS_NAME } from '../config';

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  accessToken = signal(localStorage.getItem(ACCESS_TOKEN_LS_NAME));
  refreshToken = signal(localStorage.getItem(REFRESH_TOKEN_LS_NAME));

  setAccessToken(value: string | null) {
    this.accessToken.set(value);

    if (value) {
      localStorage.setItem(ACCESS_TOKEN_LS_NAME, value);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_LS_NAME);
    }
  }

  setRefreshToken(value: string | null) {
    this.refreshToken.set(value);

    if (value) {
      localStorage.setItem(REFRESH_TOKEN_LS_NAME, value);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_LS_NAME);
    }
  }

  clear() {
    this.setAccessToken(null);
    this.setRefreshToken(null);
  }
}
