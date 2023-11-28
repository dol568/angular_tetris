import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PanelComponent} from "./panel/panel.component";
import {ListComponent} from "./list/list.component";
import {TetrisComponent} from "./tetris/tetris.component";
import {IUser} from "../model/IUser";
import {GameStatus, IPanel} from "../model/IPanel";
import {HallOfFameComponent} from "./hall-of-fame/hall-of-fame.component";
import {IHallFame} from "../model/IHallFame";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PanelComponent, ListComponent, TetrisComponent, HallOfFameComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  @Input() user: IUser;
  panel: IPanel= { points: 0, bestScore: 0, gameStatus: GameStatus.READY, display: '00:00:00', tableData: [] }
  hallFame: IHallFame[];

  getPanel(panel: IPanel) {
    this.panel = panel;
  }

  getScores(hallFame: IHallFame[]) {
    this.hallFame = hallFame;
  }
}
