import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {GameStatus, IPanel} from "../model/IPanel";
import {IHallFame} from "../model/IHallFame";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  #panel: WritableSignal<IPanel> = signal<IPanel | undefined>({
    points: 0,
    bestScore: 0,
    gameStatus: GameStatus.READY,
    display: '00:00:00',
    tableData: []
  });
  #hallFame: WritableSignal<IHallFame[]> = signal<IHallFame[]>([]);
  panel: Signal<IPanel> = computed(this.#panel);
  hallFame: Signal<IHallFame[]> = computed(this.#hallFame);

  public loadData() {
    const foundPanelData = localStorage.getItem('panelData');
    const foundHallFameData = localStorage.getItem('hallFame');
    if (foundPanelData) {
      this.#panel.set(JSON.parse(foundPanelData));
    } else {
      this.#panel.set({points: 0, bestScore: 0, gameStatus: GameStatus.READY, display: '00:00:00', tableData: []});
    }
    if (foundHallFameData) {
      this.#hallFame.set(JSON.parse(foundHallFameData));
    } else {
      this.#hallFame.set([]);
    }
  }

  public setPanel(data: IPanel) {
    localStorage.setItem('panelData', JSON.stringify(data));
    this.#panel.set(data);
  }

  public setHighScores(data: IHallFame[]) {
    localStorage.setItem('hallFame', JSON.stringify(data));
    this.#hallFame.set(data);
  }
}
