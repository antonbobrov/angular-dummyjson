export const API = {
  baseUrl: 'https://dummyjson.com',
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
} as const;

export function apiUrl(path: string): string {
  return `${API.baseUrl}${path}`;
}
