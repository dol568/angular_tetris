import {Component, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
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
  @Output() order = new EventEmitter<void>();
  changeOrderSignal: WritableSignal<boolean> = signal<boolean>(false);

  changeOrder() {
    this.changeOrderSignal.set(this.changeOrderSignal() === false);
    this.order.emit();
  }
}
