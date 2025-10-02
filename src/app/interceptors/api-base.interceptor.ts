import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environments/environment';

export const ApiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({ url: `${environment.apiUrl}/${req.url}`, credentials: 'include' });
  return next(apiReq);
};
