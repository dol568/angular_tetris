import {
  Component,
  computed,
  inject,
  OnDestroy,
  Signal,
  signal,
  WritableSignal,
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
import { concatMap, Subject, takeUntil, timer } from 'rxjs';
import { GameService } from '../../../services/game.service';
import { User } from '../../../model/User';
import { AccountService } from '../../../services/account.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TableScoresComponent } from './table-scores/table-scores.component';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { HallFame } from '../../../model/HallFame';

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
  #snackBarService: SnackbarService = inject(SnackbarService);
  #accountService: AccountService = inject(AccountService);
  #gameService: GameService = inject(GameService);
  #activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  parentParams: Signal<ParamMap> = toSignal(
    this.#activatedRoute.parent.paramMap
  );
  gameType: string = this.parentParams().get('gameType');
  color: string = this.parentParams().get('colors');

  currentUser: Signal<User> = this.#accountService.user;
  hallFameData: Signal<HallFame[]> = this.#gameService.hallFame;

  term: WritableSignal<{ value: string; exact: boolean }> = signal<{
    value: string;
    exact: boolean;
  }>({ value: '', exact: false });
  sort: WritableSignal<'asc' | 'desc'> = signal<'asc' | 'desc'>('desc');

  hallFame: Signal<HallFame[]> = computed(() => {
    const { value, exact } = this.term();
    const filteredData = new FilterPipe().transform(
      [...this.hallFameData()],
      'name',
      value,
      exact
    );
    const sortedAndFilteredData = new SortPipe().transform(
      [...filteredData],
      this.sort() === 'desc',
      'score'
    );

    return sortedAndFilteredData
      .slice(0, 10)
      .map((row, index) => ({ ...row, id: index + 1 }));
  });

  constructor() {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.#destroySubject$.next();
    this.#destroySubject$.complete();
  }

  public applyFilter(filterValue: string, exact: boolean = false): void {
    this.term.set({ value: filterValue.trim(), exact });
  }

  public showMyScores(event: MatCheckboxChange): void {
    const isChecked = event.checked ?? false;
    isChecked
      ? this.term.set({ value: this.currentUser()?.username, exact: true })
      : this.term.set({ value: '', exact: false });
  }

  public toggle(event: MatCheckboxChange): void {
    const isChecked = event.checked ?? false;
    isChecked ? this.stopTimer() : this.startTimer();
  }

  public startTimer(): void {
    timer(0, 30000)
      .pipe(
        concatMap(() => this.#gameService.getScores(this.gameType)),
        takeUntil(this.#destroySubject$)
      )
      .subscribe({
        next: () => this.#snackBarService.openSnackBar('Scores data retrieved'),
        error: (err) => console.log(err),
      });
  }

  public stopTimer(): void {
    this.#destroySubject$.next();
    this.#snackBarService.openSnackBar(
      'Cancelled retrieving data every 30 seconds'
    );
  }

  public getSortOrder(order: 'asc' | 'desc'): void {
    this.sort.set(order);
  }
}
