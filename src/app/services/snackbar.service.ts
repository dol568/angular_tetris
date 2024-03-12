import {inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    #snackBar = inject(MatSnackBar);

    public success(message: string, messageClose: string) {
        this.#getSnack(message, messageClose, 'success-snackbar');
    }

    public error(message: string, messageClose: string) {
        this.#getSnack(message, messageClose, 'error-snackbar');
    }

    #getSnack(message: string, messageClose: string, panelClass: string) {
        const config = new MatSnackBarConfig();
        config.panelClass = [`${panelClass}`];
        config.duration = 5000;
        this.#snackBar.open(message, messageClose, config);
    }
}
