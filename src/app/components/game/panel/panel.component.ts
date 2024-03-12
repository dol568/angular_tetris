import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IPanel, GameStatus} from "../../../model/IPanel";

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  GameStatus = GameStatus;
  @Input() panel: IPanel;
}
