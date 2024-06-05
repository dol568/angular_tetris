import { Routes } from '@angular/router';
import {
  _client_game,
  _client_notfound,
  _client_profile,
  _client_servererror,
} from './model/_client_consts';
import { authGuard } from './guards/auth.guard';
import { NavbarComponent } from './components/navbar/navbar.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/intro/intro.component').then(
        (m) => m.IntroComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: NavbarComponent,
    loadChildren: () =>
      import('./components/navbar/navbar.routes').then((r) => r.NAVBAR_ROUTES),
  },
  {
    path: _client_servererror,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/server-error/server-error.component').then(
        (m) => m.ServerErrorComponent
      ),
  },
  {
    path: _client_notfound,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/notfound/notfound.component').then(
        (m) => m.NotfoundComponent
      ),
  },
  { path: '**', redirectTo: _client_notfound },
];
