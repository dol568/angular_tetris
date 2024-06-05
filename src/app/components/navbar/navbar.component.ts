import { Component, Signal, computed, inject } from '@angular/core';
import { MatCardHeader } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCard } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { _client_profile } from '../../model/_client_consts';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../model/User';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatCardHeader,
    MatCardTitle,
    MatCard,
    MatGridListModule,
    MatFabButton,
    MatIconModule,
    CommonModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  #accountService = inject(AccountService);
  #router = inject(Router);
  #snackBarService = inject(SnackbarService);
  currentUser: Signal<User> = this.#accountService.user;
  params: Signal<any> = toSignal(this.#router.events);

  profileRoute: Signal<boolean> = computed(
    () => this.params()['url']?.includes('profile') ?? false
  );

  highRoute: Signal<boolean> = computed(
    () => this.params()['url']?.includes('highScores') ?? false
  );

  public exit(): void {
    this.#accountService.logout();
    this.#snackBarService.openSnackBar('Successfull logout');
  }

  public goToHighScores(): void {    
    this.#router.navigate(['../game', this.currentUser().game, this.currentUser().color, 'highScores']);
  }

  public goToProfile(): void {
    this.#router.navigate(['../profile', this.currentUser().username]);
  }

  public goBack(): void {
    if (this.profileRoute()) {
      this.goToGame();
    } else {
      this.exit();
    }
  }

  public goToGame(): void {
    this.#router.navigate(['../game', this.currentUser().game, this.currentUser().color]);
  }
}
