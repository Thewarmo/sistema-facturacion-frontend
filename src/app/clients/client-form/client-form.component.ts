import { ClientService } from './../cliente-services';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../client.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbar } from '../../shared/custom-snackbar/custom-snackbar';


@Component({
  selector: 'app-client-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit {

  clientForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ClientFormComponent>, private clientService: ClientService, private snackBar: MatSnackBar) {
    this.clientForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rucCedula: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSave(): void {
  if (this.clientForm.valid) {
    this.clientService.createClient(this.clientForm.value).subscribe({
      next: (newClient) => {
        this.dialogRef.close(newClient); // Cierra y devuelve el cliente creado
      },
      error: (error) => {
        const backendMessage = error?.error?.mensaje || 'Error al crear el cliente.';
        this.snackBar.openFromComponent(CustomSnackbar, {
          duration: 5000,
          data: {
            message: 'El RUC/Cédula ya está registrado.',
            type: 'error'
          },
          panelClass: ['custom-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}

  onCancel(): void {
    this.dialogRef.close(); // Simplemente cierra el diálogo
  }
  

}
