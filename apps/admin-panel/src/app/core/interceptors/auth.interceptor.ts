import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:3000/api/v1';
const TOKEN_KEY = 'luxe_token';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Only attach token for requests to our API
  if (!req.url.startsWith(API_BASE)) {
    return next(req);
  }

  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
