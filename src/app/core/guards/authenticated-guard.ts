import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

// export const authGuard = () => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   return auth.isAuthenticated$.pipe(
//     map((isLoggedIn) => {
//       if (isLoggedIn) {
//         return true;
//       }
//       return router.createUrlTree(['/login']);
//     })
//   );
// };

// export const unAuthGuard = () => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   return auth.isAuthenticated$.pipe(
//     map((isLoggedIn) => {
//       if (!isLoggedIn) {
//         return true;
//       }
//       return router.createUrlTree(['/']);
//     })
//   );
// };
