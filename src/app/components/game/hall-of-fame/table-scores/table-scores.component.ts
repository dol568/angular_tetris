import { Component, EventEmitter, Output, ViewChild, effect, input, signal } from '@angular/core'
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
  displayedColumns = ['id', 'name', 'score'];
  hallFame = input.required<HallFame[]>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sort = signal<'asc' | 'desc'>('desc');
  @Output() sortOrder = new EventEmitter<'asc' | 'desc'>();
  datasource;

  constructor() {
    effect(() => {
      this.datasource = new MatTableDataSource(this.hallFame());
      this.datasource.paginator = this.paginator;
    });
  }

  public changeOrder(): void {
    this.sort.set(this.sort() === 'asc' ? 'desc' : 'asc');
    this.sortOrder.emit(this.sort())
  }
  
}
