import { Component } from '@angular/core';
import { LogoutButtonComponent } from './components/logout-button';
import { UserProfileComponent } from './components/user-profile';

@Component({
  selector: 'app-home',
  imports: [LogoutButtonComponent, UserProfileComponent],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {}
