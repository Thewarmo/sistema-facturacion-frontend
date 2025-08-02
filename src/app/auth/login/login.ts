import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Importaciones de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;
  hidePassword: boolean = true;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }
    
    this.errorMessage = null;
    this.isLoading = true;
    
    
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: response => {
        
        
        
        this.isLoading = false;
        // Redirigir al usuario a una página principal o dashboard
        setTimeout(() => {
          
          this.router.navigate(['/dashboard']);
        }, 100);
      },
      error: err => {
        
        this.isLoading = false;
        // Mostrar un mensaje de error al usuario
        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.';
        } else {
          this.errorMessage = 'Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo más tarde.';
        }
      }
    });
  }
}
