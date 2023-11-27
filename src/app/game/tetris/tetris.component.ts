import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TetrisCoreComponent, TetrisCoreModule} from "ngx-tetris";
import {Panel} from "../../model/Panel";
import {User} from "../../model/User";
import {HallFame} from "../../model/HallFame";

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
  @Output() panelData = new EventEmitter<Panel>();
  @Output() scoreData = new EventEmitter<HallFame[]>();
  @Input() user: User;
  panel: Panel = new Panel();
  hallFame: HallFame[] = [];
  interval: number;
  time: number = 0;

  ngOnInit(): void {
    if (localStorage.getItem('panel') != null) {
      this.panel = JSON.parse(localStorage.getItem('panel'));
      this.panel.gameStatus = 'READY';
      this.panel.points = 0;
      clearInterval(this.interval);
      this.time = 0;
      this.panel.display = this.transform(this.time);
      this.savePanel();
    }
    if (localStorage.getItem('hallFame') != null) {
      this.hallFame = JSON.parse(localStorage.getItem('hallFame'));
      this.scoreData.emit(this.hallFame);
    }
  }

  start() {
    this.panel.gameStatus = 'STARTED';
    this.interval = setInterval(() => {
      this.time++;
      this.panel.display = this.transform(this.time);
    }, 1000);
    this.panel.tableData.push({timestamp: new Date(), actionName: 'Started the game'});
    this.savePanel();
    this._tetris.actionStart();
  }

  stop() {
    this.panel.gameStatus = 'PAUSED';
    clearInterval(this.interval);
    this.panel.display = this.transform(this.time);
    this.panel.tableData.push({timestamp: new Date(), actionName: 'Paused the game'});
    this.savePanel();
    this._tetris.actionStop();
  }

  reset() {
    this.panel.points = 0;
    clearInterval(this.interval);
    this.time = 0;
    this.panel.display = this.transform(this.time);
    this.panel.tableData.push({timestamp: new Date(), actionName: 'Reset the game'});
    this.panel.gameStatus === 'STARTED'
      ? this.panel.gameStatus = 'STARTED'
      : this.panel.gameStatus = 'READY'
    this.savePanel();
    this._tetris.actionReset();
    if (this.panel.gameStatus === 'STARTED') {
      this.start();
    } else {
      this.panel.gameStatus = 'READY';
    }
  }

  onLineCleared() {
    this.panel.points += 100;
    this.panel.tableData.push({timestamp: new Date(), actionName: 'Cleared a line'});
    if (this.panel.points > this.panel.bestScore) {
      this.panel.bestScore = this.panel.points;

      const existingEntry = this.hallFame.find(hall => hall.username === this.user.username);

      if (existingEntry) {
        existingEntry.bestScore = this.panel.bestScore;
      } else {
        this.hallFame.push({username: this.user.username, bestScore: this.panel.bestScore});
      }
      this.saveHighestScore();
    }
    this.savePanel();
  }

  onGameOver() {
    alert(`You lost. Your score was ${this.panel.points}`)
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
    this.panelData.emit(this.panel);
    localStorage.setItem('panel', JSON.stringify(this.panel));
  }

  private saveHighestScore() {
    this.scoreData.emit(this.hallFame);
    localStorage.setItem('hallFame', JSON.stringify(this.hallFame));
  }

  left() {
    this._tetris.actionLeft();
  }

  right() {
    this._tetris.actionRight();
  }

  down() {
    this._tetris.actionDown();
  }

  rotate() {
    this._tetris.actionRotate();
  }

  drop() {
    this._tetris.actionDrop();
  }

  @HostListener('window:keydown.arrowleft', ['$event'])
  moveLeft(event: KeyboardEvent) {
    event.stopPropagation()
    this.left()
  }

  @HostListener('window:keydown.arrowright', ['$event'])
  moveRight(event: KeyboardEvent) {
    event.stopPropagation()
    this.right()
  }

  @HostListener('window:keydown.arrowdown', ['$event'])
  moveDown(event: KeyboardEvent) {
    event.stopPropagation()
    this.down()
  }

  @HostListener('window:keydown.arrowup', ['$event'])
  rotatePiece(event: KeyboardEvent) {
    event.stopPropagation()
    this.rotate()
  }

    @HostListener('window:keydown.enter', ['$event'])
    dropPiece(event: KeyboardEvent) {
        event.stopPropagation()
        this.drop()
    }
}
