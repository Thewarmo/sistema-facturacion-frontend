import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Producto, TipoItem } from '../producto.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../producto.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  standalone: true,
  templateUrl: './producto-dialog.component.html',
})
export class ProductoDialogComponent implements OnInit {
  tipoItem = Object.values(TipoItem);
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private dialogRef: MatDialogRef<ProductoDialogComponent>,
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data?.id],
      nombre: [this.data?.nombre || '', Validators.required],
      descripcion: [this.data?.descripcion],
      precioUnitario: [this.data?.precioUnitario || 0, Validators.required],
      stock: [this.data?.stock || 0],
      tipoItem: [this.data?.tipoItem || 'PRODUCTO', Validators.required],
      categoriaId: [{ value: 1, disabled: true }],
    });
  }

  guardar(): void {
  if (this.form.invalid) {
    return;
  }

  const producto = this.form.value;
  const obs = producto.id
    ? this.productoService.update(producto.id, producto)
    : this.productoService.create(producto);

  obs.subscribe({
    next: (value: Producto) => {
      console.log('Producto guardado exitosamente:', value);
      this.dialogRef.close(value);
      Swal.fire({
        icon: 'success',
        title: producto.id ? 'Producto actualizado' : 'Producto creado',
        showConfirmButton: false,
        timer: 1500
      });
    },
    error: (error: any) => {
      console.error('Error al guardar el producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar el producto',
      });
    }
  });
}
}

