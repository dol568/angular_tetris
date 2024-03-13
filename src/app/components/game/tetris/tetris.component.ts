import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output, signal,
    ViewChild, WritableSignal
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TetrisCoreComponent, TetrisCoreModule} from "ngx-tetris";
import {GameStatus, IPanel} from "../../../model/IPanel";
import {IUser} from "../../../model/IUser";
import {IHallFame} from "../../../model/IHallFame";
import {
    _action_game_over,
    _action_line_cleared,
    _action_paused_game, _action_reset_game,
    _action_started_game,
    _localstorage_hall_fame,
    _localstorage_panel
} from "../../../model/_const_vars";
import {AccountService} from "../../../services/account.service";
import {GameService} from "../../../services/game.service";

@Component({
    selector: 'app-tetris',
    standalone: true,
    imports: [CommonModule, TetrisCoreModule],
    templateUrl: './tetris.component.html',
    styleUrl: './tetris.component.scss'
})
export class TetrisComponent implements OnInit, OnDestroy {
    @ViewChild(TetrisCoreComponent)
    private _tetris: TetrisCoreComponent;
    @Output() panelData = new EventEmitter<IPanel>();
    @Output() scoreData = new EventEmitter<IHallFame[]>();
    @Output() gameOverScore = new EventEmitter<number>();
    @Input() currentUser: IUser;
    @Input() panel: IPanel;
    @Input() hallFame: IHallFame[];
    interval: number = 0;
    protected readonly GameStatus = GameStatus;

    time: WritableSignal<number> = signal<number>(0);
    blackAndWhiteSignal: WritableSignal<boolean> = signal<boolean>(false);

    bbc = input.required<string>

    ngOnInit(): void {
        this.panel.gameStatus = GameStatus.READY;
    }

    ngOnDestroy(): void {
        this._tetris.actionStop();
        this._tetris.actionReset();
    }

    public start(): void {
        this.panel.gameStatus = GameStatus.STARTED;
        this.interval = setInterval(() => {
            this.time.update(time => time + 1);
            this.panel.display = this.#transform(this.time());
        }, 1000);
        this.panel.tableData.push({timestamp: new Date(), actionName: _action_started_game});
        this.#savePanel();
        this._tetris.actionStart();
    }

    public stop(): void {
        this.panel.gameStatus = GameStatus.PAUSED;
        clearInterval(this.interval);
        this.panel.display = this.#transform(this.time());
        this.panel.tableData.push({timestamp: new Date(), actionName: _action_paused_game});
        this.#savePanel();
        this._tetris.actionStop();
    }

    public reset(): void {
        this.#clearPanel();
        this.panel.tableData.push({timestamp: new Date(), actionName: _action_reset_game});
        this.panel.gameStatus === GameStatus.STARTED
            ? this.panel.gameStatus = GameStatus.STARTED
            : this.panel.gameStatus = GameStatus.READY
        this.#savePanel();
        this._tetris.actionReset();
        this.panel.gameStatus === GameStatus.STARTED
            ? this.start()
            : this.panel.gameStatus = GameStatus.READY;

    }

    public onLineCleared(): void {
        this.panel.points += 100;
        this.panel.tableData.push({timestamp: new Date(), actionName: _action_line_cleared});
        if (this.panel.points > this.panel.bestScore) {
            this.panel.bestScore = this.panel.points;

            const existingEntry = this.hallFame.find(entry => entry.username === this.currentUser.username);

            if (existingEntry) {
                if (existingEntry.bestScore < this.panel.bestScore) {
                    existingEntry.bestScore = this.panel.bestScore;
                }
            } else {
                this.hallFame.push({username: this.currentUser.username, bestScore: this.panel.bestScore});
            }
            this.#saveHighestScore();
        }
        this.#savePanel();
    }

    public onGameOver(): void {
        this.gameOverScore.emit(this.panel.points)
        this.#clearPanel();
        this.panel.tableData.push({timestamp: new Date(), actionName: _action_game_over});
        this.panel.gameStatus = GameStatus.READY;
        this.#savePanel();
        this._tetris.actionReset();
    }

    #transform(value: number): string {
        const sec_num = value;
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        const seconds = sec_num - (hours * 3600) - (minutes * 60);

        return (hours < 10 ? '0' + hours : hours) +
            ':' + (minutes < 10 ? '0' + minutes : minutes) +
            ':' + (seconds < 10 ? '0' + seconds : seconds);
    }

    #clearPanel(): void {
        this.panel.points = 0;
        clearInterval(this.interval);
        this.time.set(0);
        this.panel.display = this.#transform(this.time());
    }

    #savePanel(): void {
        this.panelData.emit(this.panel);
    }

    #saveHighestScore(): void {
        this.hallFame.sort((a, b) => b.bestScore - a.bestScore);
        this.scoreData.emit(this.hallFame);
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
        event.stopPropagation();
        this.left();
    }

    @HostListener('window:keydown.arrowright', ['$event'])
    moveRight(event: KeyboardEvent) {
        event.stopPropagation();
        this.right();
    }

    @HostListener('window:keydown.arrowdown', ['$event'])
    moveDown(event: KeyboardEvent) {
        event.stopPropagation();
        this.down();
    }

    @HostListener('window:keydown.arrowup', ['$event'])
    rotatePiece(event: KeyboardEvent) {
        event.stopPropagation();
        this.rotate();
    }

    @HostListener('window:keydown.enter', ['$event'])
    dropPiece(event: KeyboardEvent) {
        event.stopPropagation();
        this.drop();
    }
}
