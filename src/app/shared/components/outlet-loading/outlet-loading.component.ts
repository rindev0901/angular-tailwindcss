import { Component, input } from '@angular/core';

@Component({
  selector: 'app-outlet-loading',
  template: `
    <div class="flex flex-col items-center justify-center py-16">
      <!-- TopCV Logo -->
      <div class="flex justify-center mb-6">
        <div class="text-2xl font-bold">
          <span class="text-emerald-600">top</span><span class="text-gray-800">cv</span>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div class="relative mb-6">
        <div class="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
        <div class="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Loading Message -->
      <div class="text-center space-y-2 max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ message() }}
        </h3>
        @if (description()) {
          <p class="text-sm text-gray-600">
            {{ description() }}
          </p>
        }
      </div>

      <!-- Progress Dots -->
      <div class="flex justify-center space-x-1 mt-6">
        <div class="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
        <div class="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
        <div class="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
      </div>

      <!-- Subtle hint -->
      <p class="text-xs text-gray-400 mt-8 text-center">
        This will only take a moment...
      </p>
    </div>
  `,
  styles: [`
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .animate-pulse {
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class OutletLoadingComponent {
  message = input<string>('Loading...');
  description = input<string>();
}
