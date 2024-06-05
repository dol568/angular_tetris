import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService } from './services/account.service';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  #accountService: AccountService = inject(AccountService);
  #snackBarService: SnackbarService = inject(SnackbarService);

  ngOnInit(): void {
    this.#accountService.loadCurrentUser();
  }

  public logoutUser(): void {
    this.#accountService.logout();
    this.#snackBarService.openSnackBar('You successfully logged out');
  }
}
