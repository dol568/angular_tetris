import { Routes } from '@angular/router';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';

export const GAME_ROUTES: Routes = [
  { path: 'highScores', component: HallOfFameComponent },
];
