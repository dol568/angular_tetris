import { Injectable } from '@angular/core';
import {Panel} from "./model/Panel";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameplayService {
  private panelSource = new BehaviorSubject<Panel>(new Panel());
  panel$ = this.panelSource.asObservable();

  setPanel(panel: Panel) {
    this.panelSource.next(panel);
  }
}
