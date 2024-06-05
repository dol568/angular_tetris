import {
  Component,
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
export class ProfileComponent {
  #snackBarService = inject(SnackbarService);
  imageChangedEvent: WritableSignal<any> = signal<any>('');
  #accountService = inject(AccountService);
  #activatedRoute = inject(ActivatedRoute);
  #dialog = inject(MatDialog)
  params: Signal<ParamMap> = toSignal(this.#activatedRoute.paramMap);
  parentParams: Signal<ParamMap> = toSignal(this.#activatedRoute.parent.paramMap);
  username = this.params().get('username');
  displayedColumns: string[] = ['id', 'name', 'score'];
  #gameService = inject(GameService);
  game = signal<string>('tetris');
  currentUser = this.#accountService.user;
  sort = signal<'asc' | 'desc'>('desc');

  hallFame = computed(() => {
    return this.#gameService
      .getSortedAndFilteredScores(this.sort(), this.currentUser()?.username)
      .map((row, index) => ({ ...row, id: index + 1 }));
  });

  public changeOrder(): void {
    this.sort.set(this.sort() === 'asc' ? 'desc' : 'asc');
  }

  constructor() {
    effect(() => {
      this.#gameService.getScores(this.game()).subscribe();
    });
  }

  openDialog(): void {
    const dialogRef = this.#dialog.open(UpdateProfileDialogComponent, {
      data: {
        username: this.currentUser()?.username,
        email: this.currentUser()?.email,
        bio: this.currentUser()?.bio,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.#accountService.updateUserProfile(result);
      this.#snackBarService.openSnackBar('Profile Info updated');
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent.set(event);
    const dialogRef = this.#dialog.open(SelectImageDialogComponent, {
      width: '700px',
      data: { imageChangedEvent: this.imageChangedEvent() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.#accountService.updateUserPhoto(result);
      this.#snackBarService.openSnackBar('Profile Image updated');
    });
  }

  getSortOrder(order: 'asc' | 'desc') {
    this.sort.set(order);
  }
}
