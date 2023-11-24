import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./navbar/navbar.component";
import {LoginComponent} from "./login/login.component";
import {GameComponent} from "./game/game.component";
import {User} from "./User";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, LoginComponent, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angularTetris';
  user: User;



  private loadCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  getUser(user: User) {
    this.user = user;
  }

  logoutUser() {
    this.user = null; // or set to an empty user state
    localStorage.clear();
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }
}
