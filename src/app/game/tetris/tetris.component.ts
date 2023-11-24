import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TetrisCoreComponent, TetrisCoreModule} from "ngx-tetris";
import {GameplayService} from "../../gameplay.service";
import {Panel} from "../../Panel";

@Component({
  selector: 'app-tetris',
  standalone: true,
  imports: [CommonModule, TetrisCoreModule],
  templateUrl: './tetris.component.html',
  styleUrl: './tetris.component.scss'
})
export class TetrisComponent implements OnInit {
  @ViewChild(TetrisCoreComponent)
  private _tetris: TetrisCoreComponent;
  panel: Panel;
  interval: number;
  time: number = 0;

  constructor(private gs: GameplayService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('panel') != null) {
      this.panel = JSON.parse(localStorage.getItem('panel'));
      this.panel.gameStatus = 'READY';
      this.panel.points = 0;
      clearInterval(this.interval);
      this.time = 0;
      this.panel.display = this.transform(this.time);
      this.gs.setPanel(this.panel);
      this.gs.panel$.subscribe(value => this.panel = value);
    } else {
      this.gs.panel$.subscribe(value => this.panel = value);
    }
  }

  start() {
    this.gs.panel$.subscribe(value => this.panel = value);
    this.panel.gameStatus = 'STARTED';
    this.interval = setInterval(() => {
      this.time++;
      this.panel.display = this.transform(this.time);
    }, 1000);
    this.panel.tableData.push({timestamp: new Date(), actionName: 'Player started the game'});
    this.savePanel();
    this._tetris.actionStart();
  }

  stop() {
    this.gs.panel$.subscribe(value => this.panel = value);
    this.panel.gameStatus = 'PAUSED';
    clearInterval(this.interval);
    this.panel.display = this.transform(this.time);
    this.panel.tableData.push({timestamp: new Date(), actionName: 'Player paused the game'});
    this.savePanel();
    this._tetris.actionStop();
  }

  reset() {
    this.gs.panel$.subscribe(value => this.panel = value);

    if (this.panel.points > this.panel.bestScore) {
      this.panel.bestScore = this.panel.points;
    }
    this.panel.points = 0;
    clearInterval(this.interval);
    this.time = 0;
    this.panel.display = this.transform(this.time);
    this.panel.tableData.push({timestamp: new Date(), actionName: 'Player reset the game'});
    this.panel.gameStatus === 'STARTED'
      ? this.panel.gameStatus = 'STARTED'
      : this.panel.gameStatus = 'READY';
    this.savePanel();
    this._tetris.actionReset();
    if (this.panel.gameStatus === 'STARTED') {
      this.start();
    } else {
      this.panel.gameStatus = 'READY';
    }
  }

  onLineCleared() {
    this.gs.panel$.subscribe(value => this.panel = value);
    this.panel.points += 100;
    this.panel.tableData.push({timestamp: new Date(), actionName: 'Player cleared a line'});
    if (this.panel.points > this.panel.bestScore) {
      this.panel.bestScore = this.panel.points;
    }
    this.savePanel();
  }

  onGameOver() {
    alert(`You lost. Your score was ${this.panel.points}`)
    if (this.panel.points > this.panel.bestScore) {
      this.panel.bestScore = this.panel.points;
    }
    this.panel.points = 0;
    clearInterval(this.interval);
    this.time = 0;
    this.panel.display = this.transform(this.time);
    this.panel.tableData.push({timestamp: new Date(), actionName: 'Game over'});
    this.panel.gameStatus = 'READY';
    this.savePanel();
    this._tetris.actionReset();
  }

  private transform(value: number): string {
    const sec_num = value;
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    const seconds = sec_num - (hours * 3600) - (minutes * 60);

    return (hours < 10 ? '0' + hours : hours) +
      ':' + (minutes < 10 ? '0' + minutes : minutes) +
      ':' + (seconds < 10 ? '0' + seconds : seconds);
  }

  private savePanel() {
    this.gs.setPanel(this.panel);
    localStorage.setItem('panel', JSON.stringify(this.panel));
  }
}
