import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { SnackbarService } from '../services/snackbar.service';
import { catchError, throwError } from 'rxjs';
import { _client_notfound, _client_servererror } from '../model/_client_consts';
import {Router} from "@angular/router";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbar = inject(SnackbarService);
  let errorMessage = 'Something went wrong!';

  return next(req).pipe(
    catchError((error) => {
      if (error) {
        if (error.status === 404) {
          router.navigate([`/${_client_notfound}`]);
        }
        if (error.status === 422) {
          errorMessage = `${error.error.message}`;;
        }
        if (error.status === 500) {
          router.navigate([`/${_client_servererror}`]);
        }
        snackbar.openSnackBar(errorMessage);
      }
      return throwError(() => errorMessage);
    })
  );
};
