import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { User } from '../../model/User';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { _client_game } from '../../model/_client_consts';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss',
})
export class IntroComponent implements OnInit {
  #accountService = inject(AccountService);
  #router = inject(Router);

  user: Signal<User> = this.#accountService.user;

  ngOnInit(): void {
    this.#accountService.logout();
  }

  public loginUser(data: any): void {
    let color = data.color ? 'color' : 'blackAndWhite';
    this.#accountService.login({ ...data, color }).subscribe(() => {
      this.#router.navigate([_client_game, data.game, color]);
    });
  }
}
