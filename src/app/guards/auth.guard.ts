import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AccountService} from "../services/account.service";
import {SnackbarService} from "../services/snackbar.service";

export const authGuard: CanActivateFn = (route, state) => {
  const snackBarService = inject(SnackbarService);
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/'])
        .then(() => snackBarService.error('You need to login to access this resource', 'Try again!'));
    return false;
  }
};