import {Component, computed, effect, inject, signal, Signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {User} from "../../model/User";
import {AccountService} from "../../services/account.service";
import {Router} from "@angular/router";
import {RegisterComponent} from "./register/register.component";
import { _client_game } from '../../model/_const_vars';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent {
  #accountService = inject(AccountService);
  #router = inject(Router);

  #register: WritableSignal<boolean> = signal<boolean>(false);
  register: Signal<boolean> = computed(this.#register);
  currentUser: Signal<User> = this.#accountService.user;

  public registerUser(data: User): void {
    this.#accountService.register(data);
  }

  public loginUser(data: User): void {
    this.#accountService.login(data);
  }

  public goToGame(): void {
    this.#router.navigate([_client_game]);
  }

  public enableRegister(): void {
    this.#register.set(true);
  }

  public disableRegister(): void {
    this.#register.set(false);
  }
}
