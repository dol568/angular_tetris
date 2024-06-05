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
  _localstorage_game_params,
  _localstorage_panel,
  _localstorage_user
} from '../model/_client_consts';
import { SnackbarService } from './snackbar.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { fromEvent, map, Observable, tap } from 'rxjs';
import { _api_check_token, _api_default } from '../model/_api_consts';

interface CheckAuthResponse {
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  #http: HttpClient = inject(HttpClient);
  #router: Router = inject(Router);
  #snackBarService: SnackbarService = inject(SnackbarService);
  #user: WritableSignal<User> = signal<User | undefined>(undefined);
  user: Signal<User> = computed(this.#user);

  public login(data: User): Observable<CheckAuthResponse> {
    const httpOptions = {
      headers: new HttpHeaders({ 'auth-token': data.id }),
    };

    return this.#http
      .post<CheckAuthResponse>(_api_default + _api_check_token, {}, httpOptions)
      .pipe(
        tap((response) => {
          if (!!response.success) {
            const user = {
              username: data.username,
              authenticated: true,
              id: data.id,
              color: data.color,
              game: data.game,
            };
            const foundUser = this.#getUserFromLocalStorage();
            if (foundUser && foundUser.username === data.username) {
              const updatedUser = {
                ...user,
                ...foundUser,
                id: user.id,
                authenticated: user.authenticated,
              };
              this.#setUser(updatedUser);
            } else {
              this.#setUser(user);
            }
          } else {
            this.#snackBarService.openSnackBar('Bad credentials', 'Try again!');
          }
        })
      );
  }

  public loadCurrentUser(): void {
    const foundUser = this.#getUserFromLocalStorage();
    if (foundUser) {
      this.#user.set(foundUser);
    }
  }

  public isAuthenticated(): boolean {
    return !!this.user()?.authenticated;
  }

  public logout(): void {
    const foundUser = this.#getUserFromLocalStorage();
    if (foundUser) {
      const loggedOutUser = {
        username: foundUser.username,
        authenticated: false,
        image: foundUser.image,
        email: foundUser.email,
        bio: foundUser.bio,
      };
      this.#setUser(loggedOutUser);
    }
    this.#deletePanelFromLocalStorage();
    this.#router.navigate([_client_home]);
  }

  public updateUserProfile(data: User): void {
    const foundUser = this.#getUserFromLocalStorage();
    if (foundUser) {
      const updatedUser = {
        ...foundUser,
        email: data.email,
        bio: data.bio,
      };
      this.#setUser(updatedUser);
    }
  }

  public updateUserPhoto(data: any): void {
    const foundUser = this.#getUserFromLocalStorage();
    if (foundUser) {
      this.#toBase64(data).subscribe((base64) => {
        const updatedUser = { ...foundUser, image: base64 };
        this.#setUser(updatedUser);
      });
    }
  }

  public updateColor(user: User): void {
    const foundUser = this.#getUserFromLocalStorage();
    if (foundUser) {
      const updatedUser = {
        ...foundUser,
        color: user.color,
      };
      this.#setUser(updatedUser);
    }
  }

  #toBase64(blob: Blob): Observable<string> {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return fromEvent(reader, 'load').pipe(
      map(() => {
        return (reader.result as string).split(',')[1];
      })
    );
  }

  #setUser(user: User): void {
    this.#user.set(user);
    localStorage.setItem(
      _localstorage_user,
      JSON.stringify({ ...user, id: null })
    );
  }

  #getUserFromLocalStorage(): User | null {
    const foundUser = localStorage.getItem(_localstorage_user);
    return foundUser ? JSON.parse(foundUser) : null;
  }

  #deletePanelFromLocalStorage(): void {
    localStorage.removeItem(_localstorage_panel);
  }
}
