import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  Session,
  SessionResponse,
} from '@core/models/auth.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  public readonly session = signal<SessionResponse | null>(null);

  registerEmail(data: RegisterRequest) {
    return this.http.post<RegisterResponse>('auth/sign-up/email', data);
  }

  loginEmail(data: LoginRequest) {
    return this.http.post<LoginResponse>('auth/sign-in/email', data);
  }

  getSession() {
    return this.http.get<SessionResponse | null>('auth/get-session').pipe(
      tap((session) => {
        this.setSession(session);
      })
    );
  }

  setSession(session: SessionResponse | null) {
    this.session.set(session);
  }

  get isAuthenticated() {
    return !!this.session();
  }

  logout() {
    return this.http.post('auth/sign-out', {});
  }
}
