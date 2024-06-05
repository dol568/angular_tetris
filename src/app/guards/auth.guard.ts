import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AccountService } from '../services/account.service';
import { SnackbarService } from '../services/snackbar.service';
import { _client_game, _client_home } from '../model/_client_consts';

export const authGuard: CanActivateFn = (route, state) => {
  const snackBarService = inject(SnackbarService);
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.isAuthenticated()) {
    return true;
  } else {
    router
      .navigate([_client_home])
      .then(() =>
        snackBarService.openSnackBar(
          'You need to be logged in to access this resource',
          'Try again!'
        )
      );
    return false;
  }
};
