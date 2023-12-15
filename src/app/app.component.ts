import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from "./navbar/navbar.component";
import {LoginComponent} from "./login/login.component";
import {GameComponent} from "./game/game.component";
import {IUser} from "./model/IUser";
import {_localstorage_panel, _localstorage_user} from "./model/_const_vars";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LoginComponent, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  user: IUser;

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  getUser(user: IUser) {
    this.user = user;
    localStorage.setItem(_localstorage_user, JSON.stringify(this.user));
  }

  logoutUser() {
    this.user = null;
    localStorage.removeItem(_localstorage_user);
    localStorage.removeItem(_localstorage_panel);
  }

  private loadCurrentUser() {
    const user = localStorage.getItem(_localstorage_user);
    if (user) {
      this.user = JSON.parse(user);
    }
  }
}
