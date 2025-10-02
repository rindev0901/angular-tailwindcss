import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getSession().pipe(
    map((session) => {
      if (session) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};

export const unAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getSession().pipe(
    map((session) => {
      if (!session) {
        return true;
      }
      return router.createUrlTree(['/']);
    })
  );
};
