import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    let authRequest = request;
    if (token) {
      authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        const isAuthError = error.status === 401 || error.status === 403;

        if (isAuthError && !this.isRefreshing) {
          this.isRefreshing = true;

          return this.authService.refreshToken().pipe(
            switchMap(() => {
              this.isRefreshing = false;

              const newToken = this.authService.getToken();
              if (!newToken) {
                this.authService.logout();
                this.router.navigate(['/login']);
                return throwError(() => new Error('No se pudo refrescar el token'));
              }

              const retryRequest = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${newToken}`)
              });

              return next.handle(retryRequest);
            }),
            catchError(refreshError => {
              this.isRefreshing = false;
              console.warn('El refresh token falló o expiró. Cerrando sesión.');

              this.authService.logout();
              this.router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
