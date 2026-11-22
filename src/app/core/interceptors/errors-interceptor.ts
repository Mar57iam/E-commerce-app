import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);

  return next(req).pipe(
    catchError((error: unknown) => {
      const message =
        error instanceof HttpErrorResponse
          ? getErrorMessage(error)
          : 'An unexpected error occurred. Please try again.';

      toastrService.error(message, 'FreshCart', {
        progressBar: true,
        closeButton: true,
      });

      return throwError(() => error);
    }),
  );
};

function getErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Unable to connect. Check your internet connection and try again.';
  }

  if (error.status >= 500) {
    return 'The server is temporarily unavailable. Please try again later.';
  }

  if (error.error && typeof error.error === 'object' && 'message' in error.error) {
    const apiMessage = error.error.message;
    if (typeof apiMessage === 'string' && apiMessage.trim()) {
      return apiMessage.trim().slice(0, 200);
    }
  }

  switch (error.status) {
    case 400:
      return 'The submitted information is invalid.';
    case 401:
      return 'Your email or password is incorrect, or your session has expired.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This request conflicts with the current account state.';
    case 422:
      return 'Please check the submitted information and try again.';
    case 429:
      return 'Too many requests. Please wait before trying again.';
    default:
      return 'The request could not be completed. Please try again.';
  }
}
