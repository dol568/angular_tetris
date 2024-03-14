import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HallFame } from '../../../model/HallFame';
import { SortPipe } from '../../../pipes/sort.pipe';

@Component({
  selector: 'app-hall-of-fame',
  standalone: true,
  imports: [CommonModule, SortPipe],
  templateUrl: './hall-of-fame.component.html',
  styleUrl: './hall-of-fame.component.scss',
})
export class HallOfFameComponent{
  @Output() order = new EventEmitter<void>();
  hallFameData: InputSignal<HallFame[]> = input.required<HallFame[]>();
  changeOrderSignal: WritableSignal<boolean> = signal<boolean>(false);

  public changeOrder(): void {
    this.changeOrderSignal.set(this.changeOrderSignal() === false);
    this.order.emit();
  }
}
