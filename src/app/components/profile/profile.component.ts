import {
  Component,
  OnDestroy,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { GameService } from '../../services/game.service';
import { AccountService } from '../../services/account.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileDialogComponent } from './update-profile-dialog/update-profile-dialog.component';
import { SelectImageDialogComponent } from './select-image-dialog/select-image-dialog.component';
import { TableScoresComponent } from '../game/hall-of-fame/table-scores/table-scores.component';
import { SnackbarService } from '../../services/snackbar.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../model/User';
import { FilterPipe } from '../../pipes/filter.pipe';
import { HallFame } from '../../model/HallFame';
import { SortPipe } from '../../pipes/sort.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    TableScoresComponent,
  ],
})
export class ProfileComponent implements OnDestroy {
  #destroySubject$: Subject<void> = new Subject<void>();
  #snackBarService: SnackbarService = inject(SnackbarService);
  #accountService: AccountService = inject(AccountService);
  #gameService: GameService = inject(GameService);
  #dialog: MatDialog = inject(MatDialog);
  #activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  currentUser: Signal<User> = this.#accountService.user;
  hallFameData: Signal<HallFame[]> = this.#gameService.hallFame;
  params: Signal<ParamMap> = toSignal(this.#activatedRoute.paramMap);
  username: string = this.params().get('username');
  imageChangedEvent: WritableSignal<any> = signal<any>('');
  displayedColumns: string[] = ['id', 'name', 'score'];
  game: WritableSignal<string> = signal<string>('tetris');
  sort: WritableSignal<'asc' | 'desc'> = signal<'asc' | 'desc'>('desc');

  hallFame: Signal<HallFame[]> = computed(() => {
    const filteredData = new FilterPipe().transform(
      [...this.hallFameData()],
      'name',
      this.currentUser()?.username,
      true
    );
    const sortedAndFilteredData = new SortPipe().transform(
      [...filteredData],
      this.sort() === 'desc',
      'score'
    );
    return sortedAndFilteredData.map((row, index) => ({
      ...row,
      id: index + 1,
    }));
  });

  ngOnDestroy(): void {
    this.#destroySubject$.next();
    this.#destroySubject$.complete();
  }

  public changeOrder(): void {
    this.sort.set(this.sort() === 'asc' ? 'desc' : 'asc');
  }

  constructor() {
    effect(() => {
      this.#gameService
        .getScores(this.game())
        .pipe(takeUntil(this.#destroySubject$))
        .subscribe({ error: (err) => console.log(err) });
    });
  }

  public openDialog(): void {
    const dialogRef = this.#dialog.open(UpdateProfileDialogComponent, {
      data: {
        username: this.currentUser()?.username,
        email: this.currentUser()?.email,
        bio: this.currentUser()?.bio,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.#destroySubject$))
      .subscribe({
        next: (result) => {
          this.#accountService.updateUserProfile(result);
          this.#snackBarService.openSnackBar('Profile Info updated');
        },
        error: (err) => console.log(err),
      });
  }

  public fileChangeEvent(event: any): void {
    this.imageChangedEvent.set(event);
    const dialogRef = this.#dialog.open(SelectImageDialogComponent, {
      width: '700px',
      data: { imageChangedEvent: this.imageChangedEvent() },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.#destroySubject$))
      .subscribe({
        next: (result) => {
          if (result) {
            this.#accountService.updateUserPhoto(result);
            this.#snackBarService.openSnackBar('Profile Image updated');
          }
        },
        error: (err) => console.log(err),
      });
  }

  public getSortOrder(order: 'asc' | 'desc'): void {
    this.sort.set(order);
  }
}
