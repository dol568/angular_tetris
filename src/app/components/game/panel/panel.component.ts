import { Component, InputSignal, input } from '@angular/core';
import { Panel, GameStatus } from '../../../model/Panel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
})
export class PanelComponent {
  GameStatus = GameStatus;
  panel: InputSignal<Panel> = input.required<Panel>();
}
