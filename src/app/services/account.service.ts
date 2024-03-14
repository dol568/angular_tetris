import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { User } from '../model/User';
import { Router } from '@angular/router';
import {
  _client_home,
  _localstorage_panel,
  _localstorage_user,
  _localstorage_users,
} from '../model/_const_vars';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  #router = inject(Router);
  #snackBarService = inject(SnackbarService);
  #authenticated: WritableSignal<boolean> = signal<boolean>(false);
  #users: WritableSignal<User[]> = signal<User[] | null>([]);
  #user: WritableSignal<User> = signal<User | undefined>(undefined);
  user: Signal<User> = computed(this.#user);

  constructor() {
    const foundUsers = localStorage.getItem(_localstorage_users);
    if (foundUsers) {
      const parsedData = JSON.parse(foundUsers);
      parsedData.map(data => {
        const user = new User(data.username, data.email, data.password);
        this.#users.update((users) => [...users, user]);
      });
    }
  }

  public login(data: User): void {
    const foundUser = this.#users().find(
      (user) => user.email === data.email && user.password === data.password
    );
    if (foundUser) {
      this.#user.set(foundUser);
      this.#authenticated.set(true);
      localStorage.setItem(_localstorage_user, JSON.stringify(foundUser));
    } else {
      this.#snackBarService.error('Bad credentials', '');
    }
  }

  public register(data: User): void {
    const index = this.#users().findIndex(
      (user) => user.username === data.username || user.email === data.email
    );
    if (index === -1) {
      this.#users.update((users) => [...users, data]);
      localStorage.setItem(_localstorage_users, JSON.stringify(this.#users()));
      this.#user.set(data);
      this.#authenticated.set(true);
      localStorage.setItem(_localstorage_user, JSON.stringify(data));
    } else {
      this.#snackBarService.error(
        `User with username '${data.username}' or email '${data.email}' already exists!`,
        ''
      );
    }
  }

  public loadCurrentUser(): void {
    const foundUser = localStorage.getItem(_localstorage_user);
    if (foundUser) {
      this.#user.set(JSON.parse(foundUser));
      this.#authenticated.set(true);
    }
  }

  public isAuthenticated(): boolean {
    return this.#authenticated();
  }

  public logout(): void {
    localStorage.removeItem(_localstorage_user);
    localStorage.removeItem(_localstorage_panel);
    this.#user.set(undefined);
    this.#authenticated.set(false);
    this.#router.navigate([_client_home]);
  }
}
