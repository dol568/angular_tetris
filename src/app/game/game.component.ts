import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {PanelComponent} from "./panel/panel.component";
import {ListComponent} from "./list/list.component";
import {TetrisComponent} from "./tetris/tetris.component";
import {User} from "../User";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PanelComponent, ListComponent, TetrisComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  @Input() user: User;
}
