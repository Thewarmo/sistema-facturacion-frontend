import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './custom-snackbar.html',
  styleUrl: './custom-snackbar.scss'
})
export class CustomSnackbar {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string, type: 'success' | 'error' | 'info' }) {}
}
