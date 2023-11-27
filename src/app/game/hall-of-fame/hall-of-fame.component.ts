import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {User} from "../../model/User";
import {Panel} from "../../model/Panel";
import {HallFame} from "../../model/HallFame";

@Component({
  selector: 'app-hall-of-fame',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hall-of-fame.component.html',
  styleUrl: './hall-of-fame.component.scss'
})
export class HallOfFameComponent{
  @Input() hallFame: HallFame[];


  print() {
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('top10');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'top10.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
