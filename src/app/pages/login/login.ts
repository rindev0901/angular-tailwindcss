import { Component } from '@angular/core';
import { LoginButtonComponent } from './components/login-button';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  imports: [LoginButtonComponent],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  constructor(private auth: AuthService) {
    
  }
}
