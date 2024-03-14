import {
  Component,
  computed,
  EventEmitter,
  HostListener,
  input,
  Input,
  InputSignal,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Signal,
  signal,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';

import { TetrisCoreComponent, TetrisCoreModule } from 'ngx-tetris';
import { GameStatus, TableData, Panel } from '../../../model/Panel';
import { User } from '../../../model/User';
import { HallFame } from '../../../model/HallFame';
import {
  _action_game_over,
  _action_line_cleared,
  _action_paused_game,
  _action_reset_game,
  _action_started_game,
  _localstorage_hall_fame,
  _localstorage_panel,
} from '../../../model/_const_vars';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tetris',
  standalone: true,
  imports: [TetrisCoreModule, CommonModule],
  templateUrl: './tetris.component.html',
  styleUrl: './tetris.component.scss',
})
export class TetrisComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild(TetrisCoreComponent)
  private _tetris: TetrisCoreComponent;
  @Output() panelData = new EventEmitter<Panel>();
  @Output() scoreData = new EventEmitter<HallFame[]>();
  @Output() gameOverScore = new EventEmitter<number>();
  @Input() panel: Panel;
  @Input() hallFame: HallFame[];
  currentUser: InputSignal<User> = input.required<User>();
  time: WritableSignal<number> = signal<number>(0);
  blackAndWhiteSignal: WritableSignal<boolean> = signal<boolean>(false);
  tableData: WritableSignal<TableData[]> = signal<TableData[]>([]);
  panelDataSignal: Signal<Panel> = computed(() => ({
    ...this.panel,
    tableData: this.tableData(),
  }));
  
  interval: number = 0;
  readonly GameStatus = GameStatus;

  ngOnInit(): void {
    this.panel.gameStatus = GameStatus.READY;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.tableData.set(this.panel?.tableData);
  }

  ngOnDestroy(): void {
    this._tetris.actionStop();
    this._tetris.actionReset();
  }

  public start(): void {
    this.panel.gameStatus = GameStatus.STARTED;
    this.interval = window.setInterval(() => {
      this.time.update((time) => time + 1);
      this.panel.display = this.#transform(this.time());
    }, 1000);

    this.tableData.update((values) => [...values, new TableData()]);

    this.#savePanel();
    this._tetris.actionStart();
  }

  public stop(): void {
    this.panel.gameStatus = GameStatus.PAUSED;
    clearInterval(this.interval);
    this.panel.display = this.#transform(this.time());

    this.tableData.update((values) => [
      ...values,
      new TableData(_action_paused_game),
    ]);

    this.#savePanel();
    this._tetris.actionStop();
  }

  public reset(): void {
    this.#clearPanel();

    this.tableData.update((values) => [
      ...values,
      new TableData(_action_reset_game),
    ]);

    this.panel.gameStatus === GameStatus.STARTED
      ? (this.panel.gameStatus = GameStatus.STARTED)
      : (this.panel.gameStatus = GameStatus.READY);
    this.#savePanel();
    this._tetris.actionReset();

    this.panel.gameStatus === GameStatus.STARTED
      ? this.start()
      : (this.panel.gameStatus = GameStatus.READY);
  }

  public onLineCleared(): void {
    this.panel.points += 100;
    this.tableData.update((values) => [
      ...values,
      new TableData(_action_line_cleared),
    ]);

    if (this.panel.points > this.panel.bestScore) {
      this.panel.bestScore = this.panel.points;

      const existingEntry = this.hallFame.find(
        (entry) => entry.username === this.currentUser()?.username
      );

      if (existingEntry) {
        if (existingEntry.bestScore < this.panel.bestScore) {
          existingEntry.bestScore = this.panel.bestScore;
        }
      } else {
        this.hallFame.push(new HallFame(this.currentUser()?.username,
          this.panel.bestScore)
        );
      }
      this.#saveHighestScore();
    }
    this.#savePanel();
  }

  public onGameOver(): void {
    this.gameOverScore.emit(this.panel.points);
    this.#clearPanel();

    this.tableData.update((values) => [
      ...values,
      new TableData(_action_game_over),
    ]);

    this.panel.gameStatus = GameStatus.READY;
    this.#savePanel();
    this._tetris.actionReset();
  }

  #transform(value: number): string {
    const sec_num = value;
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - hours * 3600) / 60);
    const seconds = sec_num - hours * 3600 - minutes * 60;

    return (
      (hours < 10 ? '0' + hours : hours) +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    );
  }

  #clearPanel(): void {
    this.panel.points = 0;
    clearInterval(this.interval);
    this.time.set(0);
    this.panel.display = this.#transform(this.time());
  }

  #savePanel(): void {
    this.panelData.emit(this.panelDataSignal());
  }

  #saveHighestScore(): void {
    this.hallFame.sort((a, b) => b.bestScore - a.bestScore);
    this.scoreData.emit(this.hallFame);
  }

  public left(): void {
    this._tetris.actionLeft();
  }

  public right(): void {
    this._tetris.actionRight();
  }

  public down(): void {
    this._tetris.actionDown();
  }

  public rotate(): void {
    this._tetris.actionRotate();
  }

  public drop(): void {
    this._tetris.actionDrop();
  }

  @HostListener('window:keydown.arrowleft', ['$event'])
  public moveLeft(event: KeyboardEvent): void {
    event.stopPropagation();
    this.left();
  }

  @HostListener('window:keydown.arrowright', ['$event'])
  public moveRight(event: KeyboardEvent): void {
    event.stopPropagation();
    this.right();
  }

  @HostListener('window:keydown.arrowdown', ['$event'])
  public moveDown(event: KeyboardEvent): void {
    event.stopPropagation();
    this.down();
  }

  @HostListener('window:keydown.arrowup', ['$event'])
  public rotatePiece(event: KeyboardEvent): void {
    event.stopPropagation();
    this.rotate();
  }

  @HostListener('window:keydown.enter', ['$event'])
  public dropPiece(event: KeyboardEvent): void {
    event.stopPropagation();
    this.drop();
  }
}
