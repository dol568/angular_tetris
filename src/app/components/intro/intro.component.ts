import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { User } from '../../model/User';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { _client_game } from '../../model/_client_consts';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss',
})
export class IntroComponent implements OnInit, OnDestroy {
  #destroySubject$: Subject<void> = new Subject<void>();
  #accountService: AccountService = inject(AccountService);
  #router: Router = inject(Router);
  color: WritableSignal<boolean> = signal<boolean>(true);
  user: Signal<User> = this.#accountService.user;

  ngOnInit(): void {
    this.#accountService.logout();
  }

  ngOnDestroy(): void {
    this.#destroySubject$.next();
    this.#destroySubject$.complete();
  }

  public loginUser(data: any): void {
    let color = data.color ? 'color' : 'blackAndWhite';
    this.#accountService
      .login({ ...data, color })
      .pipe(takeUntil(this.#destroySubject$))
      .subscribe({
        next: () => this.#router.navigate([_client_game, data.game, color]),
        error: (err) => console.error(err),
      });
  }

  public getColor(colored: boolean) {
    this.color.set(colored);
  }
}
