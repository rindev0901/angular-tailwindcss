import { Component, input, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-page-loading',
  imports: [LoadingSpinnerComponent],
  template: `
    @if (show()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center"
           [class]="overlayClasses()">
        <div class="bg-white rounded-lg shadow-xl p-8 mx-4 max-w-sm w-full text-center">
          <app-loading-spinner
            [variant]="spinnerVariant()"
            size="lg"
            color="primary"
            [showText]="false">
          </app-loading-spinner>

          @if (message()) {
            <h3 class="mt-4 text-lg font-semibold text-gray-900">{{ message() }}</h3>
          }

          @if (description()) {
            <p class="mt-2 text-sm text-gray-600">{{ description() }}</p>
          }

          @if (showProgress() && progress() !== undefined) {
            <div class="mt-4">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{{ progress() }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-emerald-600 h-2 rounded-full transition-all duration-300 ease-out"
                  [style.width.%]="progress()">
                </div>
              </div>
            </div>
          }

          @if (showCancel() && !hideCancel()) {
            <button
              (click)="onCancel()"
              class="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              Cancel
            </button>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .backdrop-blur {
      backdrop-filter: blur(4px);
    }
  `]
})
export class PageLoadingComponent {
  private loadingService = inject(LoadingService);

  show = input<boolean>(false);
  message = input<string>('Loading...');
  description = input<string>();
  progress = input<number>();
  showProgress = input<boolean>(false);
  showCancel = input<boolean>(false);
  hideCancel = input<boolean>(false);
  backdrop = input<'light' | 'dark' | 'blur'>('light');
  spinnerVariant = input<'spinner' | 'dots' | 'pulse' | 'ring' | 'bars'>('ring');

  // Use global loading state if no explicit show input
  get globalShow() {
    return this.show() || this.loadingService.isGlobalLoading;
  }

  get globalMessage() {
    return this.message() || this.loadingService.globalLoadingState.message || 'Loading...';
  }

  get globalProgress() {
    return this.progress() || this.loadingService.globalLoadingState.progress;
  }

  overlayClasses() {
    const backdrops = {
      light: 'bg-white bg-opacity-80',
      dark: 'bg-gray-900 bg-opacity-50',
      blur: 'bg-white bg-opacity-80 backdrop-blur'
    };

    return backdrops[this.backdrop()];
  }

  onCancel() {
    this.loadingService.stopGlobalLoading();
  }
}
