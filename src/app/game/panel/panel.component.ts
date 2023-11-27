import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Panel} from "../../model/Panel";


@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent{
  @Input() panel: Panel;
}
