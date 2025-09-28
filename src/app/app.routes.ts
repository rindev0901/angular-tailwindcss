import { Routes } from '@angular/router';
import { Home, Login, NotFound, Callback } from './pages';
import { authenticatedGuard, unauthenticatedGuard } from './guards/authenticated-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'login',
    component: Login,
    canActivate: [unauthenticatedGuard],
    redirectTo: '',
  },
  {
    path: 'auth/callback',
    component: Callback,
    canActivate: [unauthenticatedGuard],
    redirectTo: '',
  },
  { path: '**', component: NotFound },
];
