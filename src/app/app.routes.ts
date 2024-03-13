import {Routes} from "@angular/router";
import {_client_game, _client_notfound} from "./model/_const_vars";
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/intro/intro.component')
      .then(m => m.IntroComponent)
  },
  {
    path: _client_game,
    canActivate: [authGuard],
    loadComponent: () => import('./components/game/game.component')
      .then(m => m.GameComponent)
  },
  {
    path: _client_notfound,
    loadComponent: () => import('./components/notfound/notfound.component')
      .then(m => m.NotfoundComponent)
  },
  {path: '**', redirectTo: _client_notfound}
]
