import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {IUser} from "../model/IUser";
import {Router} from "@angular/router";
import {_client_home} from "../model/_const_vars";
import {SnackbarService} from "./snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    #router = inject(Router);
    #snackBarService = inject(SnackbarService);
    #isAuthenticated: boolean = false;
    #user: WritableSignal<IUser> = signal<IUser | undefined>(undefined);
    user: Signal<IUser> = computed(this.#user);
    users: IUser[] = [];

    constructor() {
        const foundUsers = localStorage.getItem('users');
        if (foundUsers) {
            this.users = JSON.parse(foundUsers);
        }
    }

    isAuthenticated() {
        return this.#isAuthenticated;
    }

    login(data: IUser) {
        const foundUser = this.users.find(user => user.email === data.email && user.password === data.password);
        if (foundUser) {
            this.#user.set(foundUser);
            this.#isAuthenticated = true;
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
        } else {
            this.#snackBarService.error('Bad credentials', '')
        }
    }

    loadCurrentUser() {
        const foundUser = localStorage.getItem('currentUser');
        if (foundUser) {
            this.#user.set(JSON.parse(foundUser));
            this.#isAuthenticated = true;
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('panelData');
        this.#user.set(undefined);
        this.#isAuthenticated = false;
        this.#router.navigate([_client_home]);
    }

    register(data: IUser) {
        const index = this.users.findIndex(user => user.username === data.username || user.email === data.email);
        if (index === -1) {
            this.users.push(data);
            localStorage.setItem('users', JSON.stringify(this.users));
            this.#user.set(data);
            this.#isAuthenticated = true;
            localStorage.setItem('currentUser', JSON.stringify(data))
        } else {
            this.#snackBarService.error(`User with username '${data.username}' or email '${data.email}' already exists!`, '');
        }
    }
}
