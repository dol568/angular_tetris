import {Component, Input, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PanelComponent} from "../panel/panel.component";
import {IPanel} from "../../../model/IPanel";
import {SortPipe} from "../../../pipes/sort.pipe";
import {FilterPipe} from "../../../pipes/filter.pipe";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, PanelComponent, SortPipe, FilterPipe, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input() panel: IPanel;
  term: string;
  changeOrderSignal: WritableSignal<boolean> = signal<boolean>(false);
}
