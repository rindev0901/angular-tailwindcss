import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';

const authenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  return auth.isAuthenticated$;
};

const unauthenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  return auth.isAuthenticated$.pipe(
    map(isAuthenticated => !isAuthenticated)
  );
};

export { authenticatedGuard, unauthenticatedGuard };
