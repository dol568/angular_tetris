import { Routes } from '@angular/router';
import { GameComponent } from '../game/game.component';

export const NAVBAR_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'game/:gameType/:colors',
        component: GameComponent,
        loadChildren: () =>
          import('./../game/game.routes').then((r) => r.GAME_ROUTES),
      },
      {
        path: 'profile/:username',
        loadComponent: () =>
          import('../profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
    ],
  },
];
