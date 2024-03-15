import {
  Component,
  computed,
  effect,
  EventEmitter,
  HostListener,
  input,
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
import { interval, Subscription } from 'rxjs';

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
  currentUser: InputSignal<User> = input.required<User>();
  panel: InputSignal<Panel> = input.required<Panel>();
  hallFame: InputSignal<HallFame[]> = input.required<HallFame[]>();
  #time: WritableSignal<number> = signal<number>(-1);
  blackAndWhiteSignal: WritableSignal<boolean> = signal<boolean>(false);
  #tableData: WritableSignal<TableData[]> = signal<TableData[]>([]);
  #points: WritableSignal<number> = signal<number>(undefined);
  #bestScore: WritableSignal<number> = signal<number>(undefined);
  gameStatus: WritableSignal<GameStatus> = signal<GameStatus>(undefined);
  #display: WritableSignal<string> = signal<string>(undefined);
  #hallFameSignal: WritableSignal<HallFame[]> = signal<HallFame[]>([]);
  panelDataSignal: Signal<Panel> = computed(() => ({
    points: this.#points(),
    bestScore: this.#bestScore(),
    gameStatus: this.gameStatus(),
    display: this.#display(),
    tableData: this.#tableData(),
  }));
  #subscription: Subscription;
  readonly GameStatus = GameStatus;

  constructor() {
    effect(() => {
      this.panelData.emit(this.panelDataSignal());
    });
  }

  ngOnInit(): void {
    this.gameStatus.set(GameStatus.READY);
    this.#clearTimer();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.#points.set(this.panel()?.points);
    this.#bestScore.set(this.panel()?.bestScore);
    this.gameStatus.set(this.panel()?.gameStatus);
    this.#display.set(this.panel()?.display);
    this.#tableData.set(this.panel()?.tableData);
    this.#hallFameSignal.set(this.hallFame());
  }

  ngOnDestroy(): void {
    this._tetris.actionStop();
    this._tetris.actionReset();
  }

  public start(): void {
    this.gameStatus.set(GameStatus.STARTED);

    this.#subscription = interval(1000).subscribe(() => {
      this.#time.update((time) => time + 1);
      this.#display.set(this.#transform(this.#time()));
    });

    this.#tableData.update((values) => [...values, new TableData()]);
    this._tetris.actionStart();
  }

  public stop(): void {
    this.gameStatus.set(GameStatus.PAUSED);
    this.#subscription.unsubscribe();

    this.#tableData.update((values) => [
      ...values,
      new TableData(_action_paused_game),
    ]);

    this._tetris.actionStop();
  }

  public reset(): void {
    this.#clearPanel();

    this.#tableData.update((values) => [
      ...values,
      new TableData(_action_reset_game),
    ]);

    this.gameStatus.set(
      this.gameStatus() === GameStatus.STARTED
        ? GameStatus.STARTED
        : GameStatus.READY
    );

    this._tetris.actionReset();
    this.gameStatus() === GameStatus.STARTED ? this.start() : null;
  }

  public onLineCleared(): void {
    this.#points.update((points) => points + 100);
    this.#tableData.update((values) => [
      ...values,
      new TableData(_action_line_cleared),
    ]);

    if (this.#points() > this.#bestScore()) {
      this.#bestScore.set(this.#points());

      const existingEntry = this.#hallFameSignal().find(
        (entry) => entry.username === this.currentUser()?.username
      );

      if (existingEntry) {
        if (existingEntry.hallFameScore < this.#bestScore()) {
          existingEntry.hallFameScore = this.#bestScore();
        }
      } else {
        this.#hallFameSignal.update((values) => {
          return [
            ...values,
            new HallFame(this.currentUser()?.username, this.#bestScore()),
          ];
        });
      }
      this.#saveHighestScore();
    }
  }

  public onGameOver(): void {
    this.gameOverScore.emit(this.#points());
    this.#clearPanel();

    this.#tableData.update((values) => [
      ...values,
      new TableData(_action_game_over),
    ]);

    this.gameStatus.set(GameStatus.READY);
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
    this.#subscription.unsubscribe();
    this.#clearTimer();
  }
  
  #clearTimer(): void {
    this.#points.set(0);
    this.#time.set(0);
    this.#display.set(this.#transform(this.#time()));
  }

  #saveHighestScore(): void {
    this.#hallFameSignal().sort((a, b) => b.hallFameScore - a.hallFameScore);
    this.scoreData.emit(this.#hallFameSignal());
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
