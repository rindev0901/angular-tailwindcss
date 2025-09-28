import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-button',
  template: '<button (click)="login()">Log in</button>',
  standalone: true,
})
export class LoginButtonComponent {
  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.loginWithRedirect();
  }
}
