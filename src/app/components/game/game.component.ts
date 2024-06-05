import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { PanelComponent } from './panel/panel.component';
import { ListComponent } from './list/list.component';
import { TetrisComponent } from './tetris/tetris.component';
import { Panel } from '../../model/Panel';
import { AccountService } from '../../services/account.service';
import { GameService } from '../../services/game.service';
import { User } from '../../model/User';
import { SnackbarService } from '../../services/snackbar.service';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  fromEvent,
  map,
  startWith,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { MatCard } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatFabButton } from '@angular/material/button';
import { MatCardContent } from '@angular/material/card';
import {
  ActivatedRoute,
  ParamMap,
  RouterOutlet,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { _client_profile } from '../../model/_client_consts';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTokenDialogComponent } from './update-token-dialog/update-token-dialog.component';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  imports: [
    PanelComponent,
    ListComponent,
    TetrisComponent,
    MatGridListModule,
    MatCard,
    MatCardHeader,
    MatSidenavModule,
    MatCardTitle,
    MatButton,
    MatFabButton,
    MatCheckbox,
    MatCardContent,
    CommonModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    MatListModule,
    RouterOutlet,
  ],
})
export class GameComponent implements OnInit, OnDestroy {
  #destroySubject$: Subject<void> = new Subject<void>();
  #accountService = inject(AccountService);
  #gameService = inject(GameService);
  #snackBarService = inject(SnackbarService);
  #activatedRoute = inject(ActivatedRoute);
  params: Signal<ParamMap> = toSignal(this.#activatedRoute.paramMap);

  gameType;
  color;

  panel: Signal<Panel> = this.#gameService.panel;
  currentUser: Signal<User> = this.#accountService.user;

  columns;
  colspan1;
  colspan2;
  colspan3;
  rowHeight;

  constructor(public dialog: MatDialog) {
    effect(() => {
      this.#activatedRoute.paramMap
        .pipe(
          tap((params) => {
            this.gameType = params.get('gameType');
            this.color = params.get('colors');
          }),
          takeUntil(this.#destroySubject$)
        )
        .subscribe({
          error: (err) => console.error(err),
        });
    });
  }

  ngOnInit(): void {
    this.#gameService.loadData();
    this.#snackBarService.openSnackBar('Game data retrieved');

    fromEvent(window, 'resize')
      .pipe(
        map((event) => (event.target as any).innerWidth),
        startWith(window.innerWidth)
      )
      .subscribe((width) => {
        this.rowHeight = '39rem';
        if (width > 1330) {
          this.columns = 9;
          this.colspan1 = 2;
          this.colspan2 = 4;
          this.colspan3 = 3;
        } else if (width > 750 && width <= 1330) {
          this.columns = 6;
          this.colspan1 = 2;
          this.colspan2 = 4;
          this.colspan3 = 6;
        } else if (width <= 750) {
          this.columns = 1;
          this.colspan1 = 1;
          this.colspan2 = 1;
          this.colspan3 = 1;
        }
      });
  }

  ngOnDestroy(): void {
    this.#destroySubject$.next();
    this.#destroySubject$.complete();
  }

  public getPanel(panel: Panel): void {
    this.#gameService.setPanel(panel);
  }

  public setColor(color: string) {
    this.#accountService.updateColor({ ...this.currentUser(), color });
  }

  public getGameOverScore(gameOverScore: number): void {
    if (this.currentUser()?.id) {

      this.#gameService
        .postScoreOnGameOver(gameOverScore, this.currentUser(), this.gameType)
        .subscribe(() => {
          this.#snackBarService.openSnackBar(
            `Game over. You scored: ${gameOverScore} points`
          );
        });
    } else {

      this.openDialog(gameOverScore)
    }
  }

  openDialog(gameOverScore: number): void {
    const dialogRef = this.dialog.open(UpdateTokenDialogComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.id) {
        this.#gameService
        .postScoreOnGameOver(gameOverScore, {...this.currentUser(), id: result.id}, this.gameType)
        .subscribe(() => {
          this.#snackBarService.openSnackBar(
            `Game over. You scored: ${gameOverScore} points`
          );
        });
      } else {
        this.#snackBarService.openSnackBar('Your score was not sent');
      }
    });
  }
}
