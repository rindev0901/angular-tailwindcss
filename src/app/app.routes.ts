import { Routes } from '@angular/router';
import { Home, Login, NotFound, SignUp } from './pages';
import { authGuard, unAuthGuard } from '@core/guards/authenticated-guard';

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
    path: 'register',
    component: SignUp,
    canActivate: [unAuthGuard],
  },
  {
    path: '**',
    component: NotFound,
  },
];
