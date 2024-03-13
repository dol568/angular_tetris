import {Component, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {PanelComponent} from "./panel/panel.component";
import {ListComponent} from "./list/list.component";
import {TetrisComponent} from "./tetris/tetris.component";
import {IPanel} from "../../model/IPanel";
import {HallOfFameComponent} from "./hall-of-fame/hall-of-fame.component";
import {IHallFame} from "../../model/IHallFame";
import {AccountService} from "../../services/account.service";
import {GameService} from "../../services/game.service";
import {IUser} from "../../model/IUser";
import {SnackbarService} from "../../services/snackbar.service";

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule, PanelComponent, ListComponent, TetrisComponent, HallOfFameComponent],
    templateUrl: './game.component.html',
    styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
    #accountService = inject(AccountService);
    #gameService = inject(GameService);
    #snackBarService = inject(SnackbarService);
    #location = inject(Location);

    panel: Signal<IPanel> = this.#gameService.panel;
    hallFame: Signal<IHallFame[]> = this.#gameService.hallFame;
    currentUser: Signal<IUser> = this.#accountService.user;
    title: WritableSignal<string> = signal<string>('TOP 10');

    ngOnInit(): void {
        this.#gameService.loadData();
        this.#snackBarService.success('Game data retrieved', '');
    }

    getPanel(panel: IPanel): void {
        this.#gameService.setPanel(panel);
    }

    getScores(hallFame: IHallFame[]): void {
        this.#gameService.setHighScores(hallFame);
    }

    getGameOverScore(gameOverScore: number): void {
        this.#snackBarService.error(`Game over. You scored: ${gameOverScore} points`, '');
    }

    goBack(): void {
        this.#location.back();
    }

    getOrder() {
        this.title.set(this.title() === 'TOP 10' ? 'LOWEST 10' : 'TOP 10');
    }
}
