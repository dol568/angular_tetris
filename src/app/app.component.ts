import {
  Component,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GameComponent } from './components/game/game.component';
import { User } from './model/User';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/intro/login/login.component';
import { AccountService } from './services/account.service';
import { SnackbarService } from './services/snackbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    LoginComponent,
    GameComponent,
    RouterOutlet,
    CommonModule,
  ],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  #accountService = inject(AccountService);
  #snackBarService = inject(SnackbarService);
  user: Signal<User> = this.#accountService.user;
  showNavbar: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.#accountService.loadCurrentUser();
  }

  public logoutUser(): void {
    this.#accountService.logout();
    this.#snackBarService.openSnackBar('You successfully logged out');
  }
}
