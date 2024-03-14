import {
  Component,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Location } from '@angular/common';
import { PanelComponent } from './panel/panel.component';
import { ListComponent } from './list/list.component';
import { TetrisComponent } from './tetris/tetris.component';
import { Panel } from '../../model/Panel';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';
import { HallFame } from '../../model/HallFame';
import { AccountService } from '../../services/account.service';
import { GameService } from '../../services/game.service';
import { User } from '../../model/User';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    PanelComponent,
    ListComponent,
    TetrisComponent,
    HallOfFameComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  #accountService = inject(AccountService);
  #gameService = inject(GameService);
  #snackBarService = inject(SnackbarService);
  #location = inject(Location);

  panel: Signal<Panel> = this.#gameService.panel;
  hallFame: Signal<HallFame[]> = this.#gameService.hallFame;
  currentUser: Signal<User> = this.#accountService.user;
  title: WritableSignal<string> = signal<string>('TOP 10');

  ngOnInit(): void {
    this.#gameService.loadData();
    this.#snackBarService.success('Game data retrieved', '');
    
  }

  public getPanel(panel: Panel): void {
    this.#gameService.setPanel(panel);
  }

  public getScores(hallFame: HallFame[]): void {
    this.#gameService.setHighScores(hallFame);
  }

  public getGameOverScore(gameOverScore: number): void {
    this.#snackBarService.error(
      `Game over. You scored: ${gameOverScore} points`,
      ''
    );
  }

  goBack(): void {
    this.#location.back();
  }

  getOrder() {
    this.title.set(this.title() === 'TOP 10' ? 'LOWEST 10' : 'TOP 10');
  }
}
