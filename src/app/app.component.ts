import {Component, inject, OnInit, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {GameComponent} from "./components/game/game.component";
import {IUser} from "./model/IUser";
import {RouterOutlet} from "@angular/router";
import {LoginComponent} from "./components/intro/login/login.component";
import {AccountService} from "./services/account.service";
import {SnackbarService} from "./services/snackbar.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LoginComponent, GameComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  #accountService = inject(AccountService);
  #snackBarService = inject(SnackbarService)
  user: Signal<IUser> = this.#accountService.user;

  ngOnInit(): void {
    this.#accountService.loadCurrentUser();
  }

  public logoutUser(): void {
    this.#accountService.logout();
    this.#snackBarService.success('You successfully logged out', '')
  }
}
