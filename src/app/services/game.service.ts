import {
  computed,
  inject,
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
  _localstorage_user
} from '../model/_client_consts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../model/User';
import { _api_default, _api_scores } from '../model/_api_consts';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  #http: HttpClient = inject(HttpClient);
  #panel: WritableSignal<Panel> = signal<Panel | undefined>(new Panel());
  panel: Signal<Panel> = computed(this.#panel);
  #hallFame: WritableSignal<HallFame[]> = signal<HallFame[]>([]);
  hallFame: Signal<HallFame[]> = computed(this.#hallFame);

  public loadData(): void {
    const foundPanelData = this.#getUserFromLocalStorage();
    if (foundPanelData) {
      const tableData: TableData[] = foundPanelData.tableData.map((data) => {
        return new TableData(data.actionName, new Date(data.timestamp));
      });
      const panel = new Panel(
        foundPanelData.points,
        foundPanelData.bestScore,
        foundPanelData.gameStatus,
        foundPanelData.display,
        tableData
      );
      this.#panel.set(panel);
    } else {
      this.#panel.set(new Panel());
    }
  }

  #getUserFromLocalStorage(): Panel {
    const foundPanelData = localStorage.getItem(_localstorage_panel);
    return foundPanelData ? JSON.parse(foundPanelData) : null;
  }

  public setPanel(data: Panel): void {
    localStorage.setItem(_localstorage_panel, JSON.stringify(data));
    this.#panel.set(data);
  }

  public postScoreOnGameOver(
    score: number,
    user: User,
    game: string
  ): Observable<HallFame[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'auth-token': user.id }),
    };

    const body = { name: user.username, game, score };
    return this.#http
      .post<HallFame[]>(_api_default + _api_scores, body, httpOptions)
      .pipe(
        tap((response) => {
          this.#hallFame.set(response);
        })
      );
  }

  public getScores(game: string): Observable<HallFame[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    return this.#http
      .get<HallFame[]>(`${_api_default}${_api_scores}/${game}`, httpOptions)
      .pipe(
        tap((response) => {
          this.#hallFame.set(response);
        })
      );
  }
}
