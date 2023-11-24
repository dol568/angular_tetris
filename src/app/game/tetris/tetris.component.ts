import {Component, ViewChild} from '@angular/core';
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
export class TetrisComponent {
    @ViewChild(TetrisCoreComponent)
    private _tetris: TetrisCoreComponent;
    panel: Panel;
    interval;
    time: number = 0;

    constructor(private gs: GameplayService) {
    }

    start() {
        this.gs.panel$.subscribe(value => this.panel = value);
        this.panel.gameStatus = 'STARTED';
        this.interval = setInterval(() => {
            if (this.time === 0) {
                this.time++;
            } else {
                this.time++;
            }
            this.panel.display = this.transform(this.time);
        }, 1000);
        this.panel.tableData.push({timestamp: new Date(), actionName: 'Player started the game'});
        this.gs.setPanel(this.panel);
        this._tetris.actionStart();
    }

    transform(value: number): string {
        const sec_num = value;
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        const seconds = sec_num - (hours * 3600) - (minutes * 60);

        return (hours < 10 ? '0' + hours : hours) +
            ':' + (minutes < 10 ? '0' + minutes : minutes) +
            ':' + (seconds < 10 ? '0' + seconds : seconds);
    }

    stop() {
        this.gs.panel$.subscribe(value => this.panel = value);
        this.panel.gameStatus = 'PAUSED';
        clearInterval(this.interval);
        this.panel.display = this.transform(this.time);
        this.panel.tableData.push({timestamp: new Date(), actionName: 'Player paused the game'});
        this.gs.setPanel(this.panel);
        this._tetris.actionStop();
    }

    reset() {
        this.gs.panel$.subscribe(value => this.panel = value);
        this.panel.gameStatus === 'STARTED'
            ? this.panel.gameStatus = 'STARTED'
            : this.panel.gameStatus = 'READY';
        this.panel.points = 0;
        clearInterval(this.interval);
        this.time = 0;
        this.panel.tableData.push({timestamp: new Date(), actionName: 'Player reset the game'});
        this.gs.setPanel(this.panel);
        this._tetris.actionReset();
    }

    onLineCleared() {
        this.gs.panel$.subscribe(value => this.panel = value);
        this.panel.points += 100;
        this.panel.tableData.push({timestamp: new Date(), actionName: 'Player cleared a line'});
        this.gs.setPanel(this.panel);
    }

    onGameOver() {
        alert(`You lost. Your score was ${this.panel.points}`)
        this.reset();
    }
}
