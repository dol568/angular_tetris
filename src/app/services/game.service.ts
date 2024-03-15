import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Panel, TableData } from '../model/Panel';
import { HallFame } from '../model/HallFame';
import {
  _localstorage_hall_fame,
  _localstorage_panel,
} from '../model/_const_vars';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  #panel: WritableSignal<Panel> = signal<Panel | undefined>(new Panel());
  #hallFame: WritableSignal<HallFame[]> = signal<HallFame[]>([]);
  panel: Signal<Panel> = computed(this.#panel);
  hallFame: Signal<HallFame[]> = computed(this.#hallFame);

  public loadData(): void {
    const foundPanelData = localStorage.getItem(_localstorage_panel);
    const foundHallFameData = localStorage.getItem(_localstorage_hall_fame);
    if (foundPanelData) {
      const parsedData: Panel = JSON.parse(foundPanelData);
      const tableData: TableData[] = parsedData.tableData.map((data) => {
        return new TableData(data.actionName, new Date(data.timestamp));
      });
      const parsedPanel = new Panel(
        parsedData.points,
        parsedData.bestScore,
        parsedData.gameStatus,
        parsedData.display,
        tableData
      );
      this.#panel.set(parsedPanel);
    } else {
      this.#panel.set(new Panel());
    }
    if (foundHallFameData) {
      const parsedData: HallFame[] = JSON.parse(foundHallFameData);
      const hallFameData: HallFame[] = parsedData.map((data) => {
        return new HallFame(data.username, data.hallFameScore);
      });
      this.#hallFame.set(hallFameData);
    } else {
      this.#hallFame.set([]);
    }
  }

  public setPanel(data: Panel): void {
    localStorage.setItem(_localstorage_panel, JSON.stringify(data));
    this.#panel.set(data);
  }

  public setHighScores(data: HallFame[]): void {
    localStorage.setItem(_localstorage_hall_fame, JSON.stringify(data));
    this.#hallFame.set(data);
  }
}
