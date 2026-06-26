import type { HttpErrorResponse } from '@angular/common/http';

export function handleError(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return 'No connection';
  }

  if (err.status === 400) {
    return 'Invalid data';
  }

  if (err.status === 404) {
    return 'Not found';
  }

  if (err.status === 429) {
    return 'Try again later';
  }

  if (err.status >= 500) {
    return 'Server error. Try again later.';
  }

  const apiMessage = err.error?.message;

  if (typeof apiMessage === 'string' && apiMessage) {
    return apiMessage;
  }

  return 'Something went wrong';
}
