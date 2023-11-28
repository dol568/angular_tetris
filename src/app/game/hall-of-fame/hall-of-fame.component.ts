import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IUser} from "../../model/IUser";
import {IPanel} from "../../model/IPanel";
import {IHallFame} from "../../model/IHallFame";
import {FilterPipe} from "../../pipes/filter.pipe";
import {SortPipe} from "../../pipes/sort.pipe";
import {isArray} from "@angular/compiler-cli/src/ngtsc/annotations/common";

@Component({
  selector: 'app-hall-of-fame',
  standalone: true,
  imports: [CommonModule, SortPipe],
  templateUrl: './hall-of-fame.component.html',
  styleUrl: './hall-of-fame.component.scss'
})
export class HallOfFameComponent{
  @Input() hallFame: IHallFame[] = [];
  reverse: boolean;

  changeOrder() {
    this.reverse = !this.reverse;
  }

  print() {
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('top10');
    console.log(tableSelect)
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    console.log(tableHtml)
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    console.log(downloadLink)
    downloadLink.download = 'top10.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

}
