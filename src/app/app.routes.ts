import { Routes } from '@angular/router';
import { Home, Login, NotFound, SignUp } from './pages';

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
    path: 'register',
    component: SignUp,
  },
  { path: '**', component: NotFound },
];
