import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="flex items-center justify-center" [class]="containerClass()">
      @switch (variant()) {
        @case ('dots') {
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-current rounded-full animate-bounce"
                 style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-current rounded-full animate-bounce"
                 style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-current rounded-full animate-bounce"
                 style="animation-delay: 300ms"></div>
          </div>
        }
        @case ('pulse') {
          <div class="w-8 h-8 bg-current rounded-full animate-pulse"></div>
        }
        @case ('ring') {
          <div class="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        }
        @case ('bars') {
          <div class="flex space-x-1">
            <div class="w-1 h-6 bg-current rounded animate-pulse"
                 style="animation-delay: 0ms"></div>
            <div class="w-1 h-6 bg-current rounded animate-pulse"
                 style="animation-delay: 150ms"></div>
            <div class="w-1 h-6 bg-current rounded animate-pulse"
                 style="animation-delay: 300ms"></div>
            <div class="w-1 h-6 bg-current rounded animate-pulse"
                 style="animation-delay: 450ms"></div>
          </div>
        }
        @default {
          <!-- Default spinner -->
          <div class="relative">
            <div class="w-8 h-8 border-2 border-gray-200 rounded-full"></div>
            <div class="absolute top-0 left-0 w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      }

      @if (showText() && text()) {
        <span class="ml-3 text-sm font-medium">{{ text() }}</span>
      }
    </div>
  `,
  styles: [`
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  variant = input<'spinner' | 'dots' | 'pulse' | 'ring' | 'bars'>('spinner');
  size = input<'sm' | 'md' | 'lg'>('md');
  color = input<'primary' | 'secondary' | 'white' | 'gray'>('primary');
  text = input<string>();
  showText = input<boolean>(false);
  containerClass = input<string>('');

  get spinnerClasses() {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12'
    };

    const colorClasses = {
      primary: 'text-emerald-600',
      secondary: 'text-gray-600',
      white: 'text-white',
      gray: 'text-gray-400'
    };

    return `${sizeClasses[this.size()]} ${colorClasses[this.color()]}`;
  }
}
