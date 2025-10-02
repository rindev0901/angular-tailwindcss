import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  template: `
    @switch (variant()) {
      @case ('text') {
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded" [class]="widthClass()"></div>
        </div>
      }
      @case ('paragraph') {
        <div class="animate-pulse space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      }
      @case ('card') {
        <div class="animate-pulse">
          <div class="bg-white rounded-lg shadow p-6 space-y-4">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div class="flex space-x-2">
              <div class="h-6 bg-gray-200 rounded px-3 w-16"></div>
              <div class="h-6 bg-gray-200 rounded px-3 w-20"></div>
              <div class="h-6 bg-gray-200 rounded px-3 w-14"></div>
            </div>
          </div>
        </div>
      }
      @case ('job-card') {
        <div class="animate-pulse">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <!-- Header with logo and badges -->
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3 flex-1">
                <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-full"></div>
                  <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div class="flex flex-col space-y-1">
                <div class="h-5 bg-gray-200 rounded w-12"></div>
                <div class="h-5 bg-gray-200 rounded w-12"></div>
              </div>
            </div>

            <!-- Job details -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-gray-200 rounded"></div>
                <div class="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-gray-200 rounded"></div>
                <div class="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-gray-200 rounded"></div>
                <div class="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>

            <!-- Skills -->
            <div class="flex flex-wrap gap-2">
              <div class="h-6 bg-gray-200 rounded px-3 w-16"></div>
              <div class="h-6 bg-gray-200 rounded px-3 w-20"></div>
              <div class="h-6 bg-gray-200 rounded px-3 w-14"></div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-2">
              <div class="h-3 bg-gray-200 rounded w-20"></div>
              <div class="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      }
      @case ('table-row') {
        <div class="animate-pulse">
          <div class="flex items-center space-x-4 py-4">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-20"></div>
            <div class="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      }
      @case ('avatar') {
        <div class="animate-pulse">
          <div [class]="avatarSize() + ' bg-gray-200 rounded-full'"></div>
        </div>
      }
      @case ('button') {
        <div class="animate-pulse">
          <div [class]="'h-10 bg-gray-200 rounded-lg ' + widthClass()"></div>
        </div>
      }
      @case ('image') {
        <div class="animate-pulse">
          <div [class]="'bg-gray-200 rounded ' + imageSize()"></div>
        </div>
      }
      @default {
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded" [class]="widthClass()"></div>
        </div>
      }
    }

    @if (repeat() > 1) {
      @for (item of Array(repeat() - 1).fill(0); track $index) {
        <div class="mt-4">
          <!-- Recursively render the same skeleton -->
          <app-skeleton-loader
            [variant]="variant()"
            [width]="width()"
            [height]="height()"
            [repeat]="1">
          </app-skeleton-loader>
        </div>
      }
    }
  `,
  styles: [`
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
  `]
})
export class SkeletonLoaderComponent {
  variant = input<'text' | 'paragraph' | 'card' | 'job-card' | 'table-row' | 'avatar' | 'button' | 'image'>('text');
  width = input<'sm' | 'md' | 'lg' | 'full' | 'auto'>('full');
  height = input<'sm' | 'md' | 'lg'>('md');
  repeat = input<number>(1);

  protected Array = Array;

  widthClass() {
    const widthClasses = {
      sm: 'w-1/4',
      md: 'w-1/2',
      lg: 'w-3/4',
      full: 'w-full',
      auto: 'w-auto'
    };
    return widthClasses[this.width()];
  }

  avatarSize() {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };
    return sizeClasses[this.height()];
  }

  imageSize() {
    const sizeClasses = {
      sm: 'w-20 h-20',
      md: 'w-32 h-32',
      lg: 'w-48 h-48'
    };
    return sizeClasses[this.height()];
  }
}
