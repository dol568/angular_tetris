import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IHallFame} from "../../../model/IHallFame";
import {SortPipe} from "../../../pipes/sort.pipe";

@Component({
  selector: 'app-hall-of-fame',
  standalone: true,
  imports: [CommonModule, SortPipe],
  templateUrl: './hall-of-fame.component.html',
  styleUrl: './hall-of-fame.component.scss'
})
export class HallOfFameComponent {
  @Input() hallFame: IHallFame[];
  reverse: boolean;

  changeOrder() {
    this.reverse = !this.reverse;
  }
}
