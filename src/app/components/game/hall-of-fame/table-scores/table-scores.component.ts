import {
  Component,
  EventEmitter,
  InputSignal,
  Output,
  ViewChild,
  WritableSignal,
  effect,
  input,
  signal,
} from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HallFame } from '../../../../model/HallFame';

@Component({
  selector: 'app-table-scores',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatIcon, MatIconModule],
  templateUrl: './table-scores.component.html',
  styleUrl: './table-scores.component.scss',
})
export class TableScoresComponent {
  @Output() sortOrder = new EventEmitter<'asc' | 'desc'>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  datasource: MatTableDataSource<HallFame, MatPaginator>;

  hallFame: InputSignal<HallFame[]> = input.required<HallFame[]>();

  displayedColumns: string[] = ['id', 'name', 'score'];
  sort: WritableSignal<'asc' | 'desc'> = signal<'asc' | 'desc'>('desc');

  constructor() {
    effect(() => {
      this.datasource = new MatTableDataSource(this.hallFame());
      this.datasource.paginator = this.paginator;
    });
  }

  public changeOrder(): void {
    this.sort.set(this.sort() === 'asc' ? 'desc' : 'asc');
    this.sortOrder.emit(this.sort());
  }
}
