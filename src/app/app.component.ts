import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from "./navbar/navbar.component";
import {LoginComponent} from "./login/login.component";
import {GameComponent} from "./game/game.component";
import {User} from "./model/User";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LoginComponent, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angularTetris';
  user: User;

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  getUser(user: User) {
    this.user = user;
  }

  logoutUser() {
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('panel');
  }

  private loadCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
  }
}
