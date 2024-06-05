import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  #snackBar = inject(MatSnackBar);

  #durationInSeconds: number = 3;
  #horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  #verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  public openSnackBar(message: string, messageClose: string = 'Close'): void {
    this.#snackBar.open(message, messageClose, {
      horizontalPosition: this.#horizontalPosition,
      verticalPosition: this.#verticalPosition,
      duration: this.#durationInSeconds * 1000,
    });
  }
}
