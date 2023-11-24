import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Panel} from "../../Panel";
import {GameplayService} from "../../gameplay.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnInit {
  panel: Panel;

  constructor(private gd: GameplayService) {
    this.gd.panel$.subscribe(value => this.panel = value);
  }

  ngOnInit(): void {
    this.gd.panel$.subscribe(value => this.panel = value);
  }


}
