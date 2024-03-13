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

  public registerUser(data: IUser): void {
    this.#accountService.register(data);
  }

  public loginUser(data: IUser): void {
    this.#accountService.login(data);
  }

  public goToGame(): void {
    this.#router.navigate(['/game']);
  }

  public enableRegister(): void {
    this.#register.set(true);
  }

  public disableRegister(): void {
    this.#register.set(false);
  }
}
