import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap, finalize } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
import { LoadingService } from '@core/services/loading.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  loadingService.startGlobalLoading('Checking authentication status...');

  return authService.getSession().pipe(
    map((session) => {
      if (session) {
        return true;
      }
      return router.createUrlTree(['/login']);
    }),
    finalize(() => {
      // Ensure loading stops even if tap doesn't execute
      loadingService.stopGlobalLoading();
    })
  );
};

export const unAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  loadingService.startGlobalLoading('Verifying access permissions...');

  return authService.getSession().pipe(
    map((session) => {
      if (!session) {
        return true;
      }
      return router.createUrlTree(['/']);
    }),
    finalize(() => {
      // Ensure loading stops even if tap doesn't execute
      loadingService.stopGlobalLoading();
    })
  );
};
