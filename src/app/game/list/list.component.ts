import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PanelComponent} from "../panel/panel.component";
import {TableData} from "../../Panel";
import {GameplayService} from "../../gameplay.service";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, PanelComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
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

  printHistory() {
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('history');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'history-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
