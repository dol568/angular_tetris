import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {PanelComponent} from "../panel/panel.component";
import {TableData} from "../../Panel";
import {GameplayService} from "../../gameplay.service";
import {interval, Observable, of} from "rxjs";

@Component({
  selector: 'app-list',
  standalone: true,
    imports: [CommonModule, PanelComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit{
  data: TableData[];

    constructor(private ds: GameplayService) {
    }

    ngOnInit(): void {
      this.getData();
    }

    getData() {
        this.ds.panel$.subscribe(value => {
          this.data = value.tableData;
        })
    }
}
