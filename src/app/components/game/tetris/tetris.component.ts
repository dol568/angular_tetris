import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
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
import {
  _action_car_overtaken,
  _action_food_eaten,
  _action_game_over,
  _action_line_cleared,
  _action_paused_game,
  _action_reset_game,
  _action_started_game,
  _client_game,
  _localstorage_hall_fame,
  _localstorage_panel,
} from '../../../model/_client_consts';
import { CommonModule } from '@angular/common';
import { interval, Subject, takeUntil } from 'rxjs';
import { NgxSnakeComponent, NgxSnakeModule } from 'ngx-snake';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NgxRaceComponent, NgxRaceModule } from 'ngx-race';
import { Hotkey, HotkeyModule, HotkeysService } from 'angular2-hotkeys';

@Component({
  selector: 'app-tetris',
  standalone: true,
  imports: [
    TetrisCoreModule,
    CommonModule,
    NgxSnakeModule,
    MatGridListModule,
    MatButton,
    MatCard,
    MatFabButton,
    MatIcon,
    MatIconModule,
    NgxRaceModule,
    HotkeyModule,
  ],
  templateUrl: './tetris.component.html',
  styleUrl: './tetris.component.scss',
})
export class TetrisComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild(NgxRaceComponent)
  private _race: NgxRaceComponent;
  @ViewChild(TetrisCoreComponent)
  private _tetris: TetrisCoreComponent;
  @ViewChild(NgxSnakeComponent)
  private _snake: NgxSnakeComponent;
  #destroySubject$: Subject<void> = new Subject<void>();
  #hotkeysService: HotkeysService = inject(HotkeysService);
  #router: Router = inject(Router);
  @Output() panelData = new EventEmitter<Panel>();
  @Output() color = new EventEmitter<string>();
  @Output() gameOverScore = new EventEmitter<number>();

  currentUser: InputSignal<User> = input.required<User>();
  panel: InputSignal<Panel> = input.required<Panel>();
  blackAndWhiteSignal = input.required<string>();

  #time: WritableSignal<number> = signal<number>(-1);

  #points: WritableSignal<number> = signal<number>(undefined);
  #bestScore: WritableSignal<number> = signal<number>(undefined);
  gameStatus: WritableSignal<GameStatus> = signal<GameStatus>(undefined);
  #display: WritableSignal<string> = signal<string>(undefined);
  #tableData: WritableSignal<TableData[]> = signal<TableData[]>([]);
  panelDataSignal: Signal<Panel> = computed(() => ({
    points: this.#points(),
    bestScore: this.#bestScore(),
    gameStatus: this.gameStatus(),
    display: this.#display(),
    tableData: this.#tableData(),
  }));
  readonly GameStatus = GameStatus;
  gameType = input.required<string>();

  constructor() {
    this.#addHotkeys();
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
  }

  ngOnDestroy(): void {
    this.#takeAction(this.gameType(), 'actionStop');
    this.#takeAction(this.gameType(), 'actionReset');
    this.#destroySubject$.next();
    this.#destroySubject$.complete();
  }

  changeTheme(colorPath: string) {
    this.color.emit(colorPath);
    this.#router.navigate([_client_game, this.gameType(), colorPath]);
  }

  public start(): void {
    this.gameStatus.set(GameStatus.STARTED);
    interval(1000)
      .pipe(takeUntil(this.#destroySubject$))
      .subscribe({
        next: () => {
          this.#time.update((time) => time + 1);
          this.#display.set(this.#transform(this.#time()));
        },
        error: (err) => console.error(err),
      });

    this.#tableData.update((values) => [...values, new TableData()]);
    this.#takeAction(this.gameType(), 'actionStart');
  }

  public stop(): void {
    this.gameStatus.set(GameStatus.PAUSED);
    this.#destroySubject$.next();

    this.#tableData.update((values) => [
      ...values,
      new TableData(_action_paused_game),
    ]);

    this.#takeAction(this.gameType(), 'actionStop');
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

    this.#takeAction(this.gameType(), 'actionReset');
    this.gameStatus() === GameStatus.STARTED ? this.start() : null;
  }

  public grantPoints(): void {
    this.#getPoints(_action_car_overtaken);
  }

  public onGrow(): void {
    this.#getPoints(_action_food_eaten);
  }

  public onLineCleared(): void {
    this.#getPoints(_action_line_cleared);
  }

  public onGameOver(): void {
    this.gameOverScore.emit(this.#points());
    this.#clearPanel();

    this.#tableData.update((values) => [
      ...values,
      new TableData(_action_game_over),
    ]);

    this.gameStatus.set(GameStatus.READY);
    this.#takeAction(this.gameType(), 'actionReset');
  }

  public left(): void {
    this.#takeAction(this.gameType(), 'actionLeft');
  }

  public right(): void {
    this.#takeAction(this.gameType(), 'actionRight');
  }

  public down(): void {
    if (this.gameType() === 'race') {
      this._race.actionTurboOff();
    } else if (this.gameType() === 'tetris') {
      this._tetris.actionDown();
    } else {
      this._snake.actionDown();
    }
  }

  public up(): void {
    if (this.gameType() === 'race') {
      this._race.actionTurboOn();
    } else if (this.gameType() === 'tetris') {
      this._tetris.actionRotate();
    } else {
      this._snake.actionUp();
    }
  }

  public drop(): void {
    this._tetris.actionDrop();
  }

  #getPoints(actionName: string) {
    this.#points.update((points) => points + 100);
    this.#tableData.update((values) => [...values, new TableData(actionName)]);

    if (this.#points() > this.#bestScore()) {
      this.#bestScore.set(this.#points());
    }
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

  #takeAction(game: string, action: string) {
    if (game === 'race') {
      this._race[action]();
    } else if (game === 'tetris') {
      this._tetris[action]();
    } else {
      this._snake[action]();
    }
  }

  #clearPanel(): void {
    this.#destroySubject$.next();
    this.#clearTimer();
  }

  #clearTimer(): void {
    this.#points.set(0);
    this.#time.set(0);
    this.#display.set(this.#transform(this.#time()));
  }

  #addHotkeys() {
    this.#hotkeysService.add(
      new Hotkey('up', (_: KeyboardEvent): boolean => {
        this.up();
        return false;
      })
    );

    this.#hotkeysService.add(
      new Hotkey('left', (_: KeyboardEvent): boolean => {
        this.left();
        return false;
      })
    );

    this.#hotkeysService.add(
      new Hotkey('down', (_: KeyboardEvent): boolean => {
        this.down();
        return false;
      })
    );

    this.#hotkeysService.add(
      new Hotkey('right', (_: KeyboardEvent): boolean => {
        this.right();
        return false;
      })
    );
    this.#hotkeysService.add(
      new Hotkey('enter', (_: KeyboardEvent): boolean => {
        this.drop();
        return false;
      })
    );
  }
}
