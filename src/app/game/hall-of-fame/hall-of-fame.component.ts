import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IHallFame} from "../../model/IHallFame";
import {SortPipe} from "../../pipes/sort.pipe";
import {_localstorage_hall_fame} from "../../model/_const_vars";
import * as XLSX from "xlsx";

@Component({
  selector: 'app-hall-of-fame',
  standalone: true,
  imports: [CommonModule, SortPipe],
  templateUrl: './hall-of-fame.component.html',
  styleUrl: './hall-of-fame.component.scss'
})
export class HallOfFameComponent implements OnInit {

  @Input() hallFame: IHallFame[];
  reverse: boolean;

  ngOnInit(): void {
    const savedHallFame = localStorage.getItem(_localstorage_hall_fame);
    if (savedHallFame) {
      this.hallFame = JSON.parse(savedHallFame);
    }
  }

  changeOrder() {
    this.reverse = !this.reverse;
  }

  print() {
    if (confirm('You are about to save TOP 10 table to a file')) {
      let tableSelect = document.getElementById('top10');
      let workbook = XLSX.utils.table_to_book(tableSelect);
      XLSX.writeFile(workbook, "HallOfFame.xls");
    }
  }
}
