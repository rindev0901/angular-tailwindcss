import { Injectable, signal } from '@angular/core';

export interface LoadingState {
  isLoading: boolean;
  message?: string | undefined;
  progress?: number | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly globalLoading = signal<LoadingState>({
    isLoading: false,
    message: undefined,
    progress: undefined
  });

  private readonly componentLoadings = signal<Map<string, LoadingState>>(new Map());

  // Global loading state
  get isGlobalLoading() {
    return this.globalLoading().isLoading;
  }

  get globalLoadingState() {
    return this.globalLoading();
  }

  // Start global loading
  startGlobalLoading(message?: string) {
    this.globalLoading.set({
      isLoading: true,
      message,
      progress: undefined
    });
  }

  // Stop global loading
  stopGlobalLoading() {
    this.globalLoading.set({
      isLoading: false,
      message: undefined,
      progress: undefined
    });
  }

  // Update global loading progress
  updateGlobalProgress(progress: number, message?: string) {
    this.globalLoading.update(state => ({
      ...state,
      progress,
      message: message || state.message
    }));
  }

  // Component-specific loading states
  startComponentLoading(componentId: string, message?: string) {
    const currentLoadings = this.componentLoadings();
    currentLoadings.set(componentId, {
      isLoading: true,
      message,
      progress: undefined
    });
    this.componentLoadings.set(new Map(currentLoadings));
  }

  stopComponentLoading(componentId: string) {
    const currentLoadings = this.componentLoadings();
    currentLoadings.delete(componentId);
    this.componentLoadings.set(new Map(currentLoadings));
  }

  isComponentLoading(componentId: string): boolean {
    return this.componentLoadings().get(componentId)?.isLoading || false;
  }

  getComponentLoadingState(componentId: string): LoadingState | undefined {
    return this.componentLoadings().get(componentId);
  }

  // Utility methods
  async withLoading<T>(
    operation: () => Promise<T>,
    componentId?: string,
    message?: string
  ): Promise<T> {
    try {
      if (componentId) {
        this.startComponentLoading(componentId, message);
      } else {
        this.startGlobalLoading(message);
      }

      const result = await operation();
      return result;
    } finally {
      if (componentId) {
        this.stopComponentLoading(componentId);
      } else {
        this.stopGlobalLoading();
      }
    }
  }

  // Simulate loading with progress
  async simulateProgressLoading(
    duration: number = 3000,
    steps: number = 10,
    message: string = 'Loading...'
  ): Promise<void> {
    this.startGlobalLoading(message);

    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
      const progress = (i / steps) * 100;
      this.updateGlobalProgress(progress, `${message} ${Math.round(progress)}%`);

      if (i < steps) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }
    }

    this.stopGlobalLoading();
  }
}
