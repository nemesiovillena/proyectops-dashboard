import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }

      console.error('HTTP Error:', errorMessage);

      if (error.status === 401) {
        console.error('Unauthorized - redirecting to login');
      }

      if (error.status === 403) {
        console.error('Forbidden - insufficient permissions');
      }

      if (error.status >= 500) {
        console.error('Server error - please try again later');
      }

      return throwError(() => error);
    })
  );
};
