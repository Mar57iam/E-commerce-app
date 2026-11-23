import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const SKIP_GLOBAL_LOADING = new HttpContextToken<boolean>(() => false);

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_GLOBAL_LOADING)) {
    return next(req);
  }

  const spinnerService = inject(NgxSpinnerService);

  if (activeRequests++ === 0) {
    void spinnerService.show('primary');
  }

  return next(req).pipe(
    finalize(() => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        void spinnerService.hide('primary');
      }
    }),
  );
};
