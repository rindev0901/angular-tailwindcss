import { Component, inject } from '@angular/core';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { OutletLoadingComponent } from '@shared/components/outlet-loading/outlet-loading.component';

@Component({
  selector: 'app-layout',
  imports: [Header, Footer, RouterOutlet, OutletLoadingComponent],
  template: `
    <app-header></app-header>
    <main class="min-h-screen bg-gray-50 relative">
      @if (loadingService.isGlobalLoading) {
      <!-- Route Loading Overlay - Only over main content -->
      <div class="min-h-screen flex items-center justify-center">
        <app-outlet-loading
          [message]="loadingService.globalLoadingState.message || 'Loading...'"
          [description]="getLoadingDescription()"
        >
        </app-outlet-loading>
      </div>
      } @else {
      <router-outlet></router-outlet>
      }
    </main>
    <app-footer></app-footer>
  `,
})
export class Layout {
  protected loadingService = inject(LoadingService);

  protected getLoadingDescription(): string {
    const message = this.loadingService.globalLoadingState.message;
    if (message?.includes('authentication')) {
      return 'Verifying your credentials...';
    }
    if (message?.includes('access')) {
      return 'Checking permissions...';
    }
    return 'Please wait a moment...';
  }
}
