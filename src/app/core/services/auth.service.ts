import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterRequest, User } from '@core/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  registerEmail(data: RegisterRequest) {
    return this.http.post<User>('auth/sign-up/email', data);
  }
}
