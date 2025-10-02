import { isPlatformBrowser } from '@angular/common';
import { Component, computed, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { LoadingService } from '@app/core/services/loading.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header {
  private platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  protected readonly isMobileMenuOpen = signal(false);

  protected userProfile = computed(() => this.authService.session()?.user);
  protected isAuthLoading = computed(() => this.authService.isLoading);
  protected isSessionLoading = computed(() =>
    this.loadingService.isComponentLoading('auth-session') || this.authService.isLoading
  );
  protected isLogoutLoading = computed(() =>
    this.loadingService.isComponentLoading('auth-logout')
  );

  constructor() {
    // Effect to handle body scroll when mobile menu state changes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (this.isMobileMenuOpen()) {
          // Disable scroll by adding CSS class
          document.body.classList.add('menu-open');
        } else {
          // Enable scroll by removing CSS class
          document.body.classList.remove('menu-open');
        }
      }
    });
  }

  protected toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  protected closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  protected navigateToLogin() {
    this.router.navigate(['/login']).then(() => this.isMobileMenuOpen.set(false));
  }

  protected navigateToRegister() {
    this.router.navigate(['/register']).then(() => this.isMobileMenuOpen.set(false));
  }

  protected logout() {
    this.loadingService.startComponentLoading('auth-logout', 'Signing you out...');
    this.authService.logout().subscribe({
      next: () => {
        this.loadingService.stopComponentLoading('auth-logout');
        this.router.navigate(['/login']).then(() => this.isMobileMenuOpen.set(false));
      },
      error: (err: any) => {
        console.error('Logout failed:', err);
        this.loadingService.stopComponentLoading('auth-logout');
        this.router.navigate(['/login']).then(() => this.isMobileMenuOpen.set(false));
      },
    });
  }
}
