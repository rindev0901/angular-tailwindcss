import { Routes } from '@angular/router';
import { Home, Login, NotFound, Callback } from './pages';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'auth/callback',
    component: Callback,
  },
  { path: '**', component: NotFound },
];
