import {
  Component,
  computed,
  inject,
  OnDestroy,
  Signal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortPipe } from '../../../pipes/sort.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFabButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { concatMap, Subject, Subscription, takeUntil, tap, timer } from 'rxjs';
import { GameService } from '../../../services/game.service';
import { User } from '../../../model/User';
import { AccountService } from '../../../services/account.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TableScoresComponent } from './table-scores/table-scores.component';
import { FilterPipe } from '../../../pipes/filter.pipe';

@Component({
  selector: 'app-hall-of-fame',
  standalone: true,
  imports: [
    CommonModule,
    SortPipe,
    FilterPipe,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatCardModule,
    MatFabButton,
    MatCheckbox,
    MatPaginatorModule,
    MatIcon,
    MatIconModule,
    TableScoresComponent,
  ],
  templateUrl: './hall-of-fame.component.html',
  styleUrl: './hall-of-fame.component.scss',
})
export class HallOfFameComponent implements OnDestroy {
  #destroySubject$: Subject<void> = new Subject<void>();
  #snackBarService = inject(SnackbarService);
  #accountService = inject(AccountService);
  #gameService = inject(GameService);
  #activatedRoute = inject(ActivatedRoute);

  parentParams: Signal<ParamMap> = toSignal(
    this.#activatedRoute.parent.paramMap
  );
  gameType = this.parentParams().get('gameType');
  color = this.parentParams().get('colors');

  currentUser: Signal<User> = this.#accountService.user;
  hallFameData = this.#gameService.hallFame;
  subscription: Subscription;

  term = signal<{ value: string; exact: boolean }>({ value: '', exact: false });
  sort = signal<'asc' | 'desc'>('desc');
  limit = signal<number>(10);

  hallFame = computed(() => {
    const { value, exact } = this.term();
    const filtered = new FilterPipe().transform(
      [...this.hallFameData()],
      'name',
      value,
      exact
    );
    const sorted = new SortPipe().transform(
      [...filtered],
      this.sort() === 'desc',
      'score'
    );

    return sorted
      .slice(0, this.limit())
      .map((row, index) => ({ ...row, id: index + 1 }));
  });

  constructor() {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.#destroySubject$.next();
    this.#destroySubject$.complete();
  }

  applyFilter(filterValue: string, exact: boolean = false) {
    this.term.set({ value: filterValue.trim(), exact });
  }

  public showMyScores(event: MatCheckboxChange): void {
    const isChecked = event.checked ?? false;
    isChecked
      ? this.term.set({ value: this.currentUser().username, exact: true })
      : this.term.set({ value: '', exact: false });
  }

  public toggle(event: MatCheckboxChange): void {
    const isChecked = event.checked ?? false;
    isChecked ? this.stopTimer() : this.startTimer();
  }

  startTimer() {
    this.subscription = timer(0, 15000)
      .pipe(concatMap(() => this.#gameService.getScores(this.gameType)))
      .pipe(takeUntil(this.#destroySubject$))
      .subscribe(() =>
        this.#snackBarService.openSnackBar('Scores data retrieved')
      );
  }

  stopTimer() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
      this.#snackBarService.openSnackBar(
        'Cancelled retrieving data every 30 seconds'
      );
    }
  }

  getSortOrder(order: 'asc' | 'desc') {
    this.sort.set(order);
  }
}
