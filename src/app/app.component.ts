import { Component, inject, OnInit, Signal } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GameComponent } from './components/game/game.component';
import { User } from './model/User';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/intro/login/login.component';
import { AccountService } from './services/account.service';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, LoginComponent, GameComponent, RouterOutlet],
  template: `
    <app-navbar [currentUser]="user()" (logout)="logoutUser()"></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: `
    .content {
      margin: 3%;
    }
  `,
})
export class AppComponent implements OnInit {
  #accountService = inject(AccountService);
  #snackBarService = inject(SnackbarService);
  user: Signal<User> = this.#accountService.user;

  ngOnInit(): void {
    this.#accountService.loadCurrentUser();
  }

  public logoutUser(): void {
    this.#accountService.logout();
    this.#snackBarService.success('You successfully logged out', '');
  }
}
