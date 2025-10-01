import { isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header {
  private platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  protected readonly isMobileMenuOpen = signal(false);

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
}
