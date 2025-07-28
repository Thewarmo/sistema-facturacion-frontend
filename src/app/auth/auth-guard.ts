import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    console.log('AuthGuard.canActivate() - Token:', this.authService.getToken());
    console.log('AuthGuard.canActivate() - isAuthenticated:', this.authService.isAuthenticated());
    if(this.authService.isAuthenticated()){
      console.log('AuthGuard: Usuario autenticado, permitiendo acceso a ruta protegida');
      return true;
    }else{
      console.log('AuthGuard: Usuario no autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
