import {
  Component,
  effect,
  input,
  InputSignal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from '../panel/panel.component';
import { TableData } from '../../../model/Panel';
import { SortPipe } from '../../../pipes/sort.pipe';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    PanelComponent,
    SortPipe,
    FilterPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIcon,
    MatIconModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['timestamp', 'actionName'];
  tableData: InputSignal<TableData[]> = input.required<TableData[]>();
  changeOrderSignal: WritableSignal<boolean> = signal<boolean>(false);
  term: WritableSignal<string> = signal<string>('');
  dataSource: MatTableDataSource<TableData[], MatPaginator>;

  constructor() {
    effect(() => {
      const filteredData = new FilterPipe().transform(
        [...this.tableData()],
        'actionName',
        this.term()
      );
      const sortedAndFilteredData = new SortPipe().transform(
        [...filteredData],
        this.changeOrderSignal(),
        'timestamp'
      );
      this.dataSource = new MatTableDataSource(sortedAndFilteredData);
      this.dataSource.paginator = this.paginator;
    });
  }
  public applyFilter(filterValue: string): void {
    this.term.set(filterValue.trim());
  }
}
