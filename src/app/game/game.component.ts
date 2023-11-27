import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {PanelComponent} from "./panel/panel.component";
import {ListComponent} from "./list/list.component";
import {TetrisComponent} from "./tetris/tetris.component";
import {User} from "../model/User";
import {Panel} from "../model/Panel";
import {HallOfFameComponent} from "./hall-of-fame/hall-of-fame.component";
import {HallFame} from "../model/HallFame";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PanelComponent, ListComponent, TetrisComponent, HallOfFameComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  @Input() user: User;
  panel: Panel = new Panel();
  hallFame: HallFame[];

  getPanel(panel: Panel) {
    this.panel = panel;
  }

  getScores(hallFame: HallFame[]) {
    this.hallFame = hallFame;
  }

}
