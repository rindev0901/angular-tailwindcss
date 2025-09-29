import { Routes } from '@angular/router';
import { Home, Login, NotFound, Callback } from './pages';
import { authGuard, unAuthGuard } from './guards/authenticated-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: Login,
    canActivate: [unAuthGuard],
  },
  {
    path: 'auth/callback',
    component: Callback,
    canActivate: [unAuthGuard],
  },
  { path: '**', component: NotFound },
];
