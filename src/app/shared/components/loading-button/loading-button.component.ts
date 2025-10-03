import { Component, input, output } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-loading-button',
  imports: [LoadingSpinnerComponent],
  template: `
    <button
      [disabled]="loading() || disabled()"
      [class]="buttonClasses()"
      (click)="handleClick()"
      [type]="type()"
    >
      @if (loading()) {
      <app-loading-spinner
        variant="ring"
        [size]="spinnerSize()"
        [color]="spinnerColor()"
        [showText]="false"
      >
      </app-loading-spinner>

      @if (loadingText()) {
      <span class="ml-2">{{ loadingText() }}</span>
      } } @else { @if (icon()) {
      <span class="mr-2" [innerHTML]="icon()"></span>
      }
      <ng-content></ng-content>
      }
    </button>
  `,
  styles: [
    `
      button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      button:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      button {
        transition: all 0.2s ease-in-out;
      }
    `,
  ],
})
export class LoadingButtonComponent {
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  variant = input<'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  icon = input<string>();
  loadingText = input<string>();
  fullWidth = input<boolean>(false);

  clicked = output<void>();

  handleClick() {
    if (!this.loading() && !this.disabled()) {
      this.clicked.emit();
    }
  }

  buttonClasses() {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const variantClasses = {
      primary: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-sm',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm',
      outline:
        'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-emerald-500',
      ghost: 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500',
    };

    const widthClass = this.fullWidth() ? 'w-full' : '';

    return `${baseClasses} ${sizeClasses[this.size()]} ${
      variantClasses[this.variant()]
    } ${widthClass}`;
  }

  spinnerSize() {
    const sizeMap = {
      sm: 'sm' as const,
      md: 'sm' as const,
      lg: 'md' as const,
    };
    return sizeMap[this.size()];
  }

  spinnerColor() {
    const colorMap = {
      primary: 'white' as const,
      secondary: 'white' as const,
      danger: 'white' as const,
      success: 'white' as const,
      outline: 'primary' as const,
      ghost: 'primary' as const,
    };
    return colorMap[this.variant()];
  }
}
