import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-user-profile',
  imports: [AsyncPipe],
  template: `
    @if (auth.user$ | async; as user) {
    <ul>
      <li>{{ user.name }}</li>
      <li>{{ user.email }}</li>
    </ul>
    }
  `,
})
export class UserProfileComponent {
  constructor(public auth: AuthService) {}
}
