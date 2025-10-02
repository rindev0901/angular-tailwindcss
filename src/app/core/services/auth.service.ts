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
import { LoadingService } from './loading.service';
import { tap, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly loadingService = inject(LoadingService);
  public readonly session = signal<SessionResponse | null>(null);
  public readonly loading = signal(false);

  registerEmail(data: RegisterRequest) {
    this.loadingService.startComponentLoading('auth-register', 'Creating your account...');
    return this.http.post<RegisterResponse>('auth/sign-up/email', data).pipe(
      finalize(() => this.loadingService.stopComponentLoading('auth-register'))
    );
  }

  loginEmail(data: LoginRequest) {
    this.loadingService.startComponentLoading('auth-login', 'Signing you in...');
    return this.http.post<LoginResponse>('auth/sign-in/email', data).pipe(
      finalize(() => this.loadingService.stopComponentLoading('auth-login'))
    );
  }

  getSession() {
    this.loading.set(true);
    this.loadingService.startComponentLoading('auth-session', 'Loading your session...');
    return this.http.get<SessionResponse | null>('auth/get-session').pipe(
      tap((session) => {
        this.setSession(session);
      }),
      finalize(() => {
        this.loading.set(false);
        this.loadingService.stopComponentLoading('auth-session');
      })
    );
  }

  setSession(session: SessionResponse | null) {
    this.session.set(session);
  }

  get isAuthenticated() {
    return !!this.session();
  }

  get isLoading() {
    return this.loading();
  }

  logout() {
    return this.http.post('auth/sign-out', {});
  }
}
