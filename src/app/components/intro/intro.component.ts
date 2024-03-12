import {Component, computed, effect, inject, signal, Signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {IUser} from "../../model/IUser";
import {AccountService} from "../../services/account.service";
import {Router} from "@angular/router";
import {RegisterComponent} from "./register/register.component";

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

  currentUser: Signal<IUser> = this.#accountService.user;
  #register: WritableSignal<boolean> = signal<boolean>(false);
  register: Signal<boolean> = computed(this.#register);

  registerUser(data: IUser) {
    this.#accountService.register(data);
  }

  loginUser(data: IUser) {
    this.#accountService.login(data);
  }

  goToGame() {
    this.#router.navigate(['/game']);
  }

  enableRegister() {
    this.#register.set(true);
  }

  disableRegister() {
    this.#register.set(false);
  }
}
