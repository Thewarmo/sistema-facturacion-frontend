import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../producto.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Producto } from '../producto.model';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-producto-imagen-form',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIcon
  ],
  templateUrl: './producto-imagen-form.component.html',
  styleUrl: './producto-imagen-form.component.scss'
})
export class ProductoImagenFormComponent implements OnInit {
  
  productos: Producto[] = [];
  productoSeleccionadoId: number | null = null;
  archivoSeleccionado: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  subiendo = false;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getAll().subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
        console.error(error);
      }
    );
  }

  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     this.archivoSeleccionado = input.files[0];
  //     // Generar vista previa
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imagenPreview = reader.result;
  //     };
  //     reader.readAsDataURL(this.archivoSeleccionado);
  //   }
  // }

  onSubmit(): void {
    if (!this.productoSeleccionadoId || !this.archivoSeleccionado) {
      Swal.fire('Campos incompletos', 'Por favor, selecciona un producto y una imagen.', 'warning');
      return;
    }

    this.subiendo = true;

    this.productoService.uploadImagen(this.productoSeleccionadoId, this.archivoSeleccionado).subscribe(
      (response) => {
        this.subiendo = false;
        Swal.fire(
          '¡Éxito!',
          `Imagen subida correctamente para el producto. URL: ${response.url}`,
          'success'
        );
        this.router.navigate(['/dashboard/productos']);
      },
      (error) => {
        this.subiendo = false;
        Swal.fire('Error', 'Hubo un problema al subir la imagen.', 'error');
        console.error(error);
      }
    );
  }

  onDragOver(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  const target = event.currentTarget as HTMLElement;
  target.style.borderColor = '#667eea';
  target.style.background = 'linear-gradient(145deg, #f0f4ff, #ffffff)';
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  const target = event.currentTarget as HTMLElement;
  if (!this.archivoSeleccionado) {
    target.style.borderColor = '#e0e0e0';
    target.style.background = 'linear-gradient(145deg, #f8f9fa, #ffffff)';
  }
}

onDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  
  const target = event.currentTarget as HTMLElement;
  target.style.borderColor = this.archivoSeleccionado ? '#4caf50' : '#e0e0e0';
  
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      this.procesarArchivo(file);
    } else {
      // Mostrar error: solo imágenes permitidas
      this.mostrarError('Solo se permiten archivos de imagen');
    }
  }
}

// Función para procesar archivo (mejorada)
procesarArchivo(file: File) {
  // Validar tamaño (ejemplo: máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB en bytes
  if (file.size > maxSize) {
    this.mostrarError('El archivo es muy grande. Máximo 5MB permitido.');
    return;
  }

  // Validar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    this.mostrarError('Tipo de archivo no permitido. Use JPG, PNG, GIF o WebP.');
    return;
  }

  this.archivoSeleccionado = file;
  this.crearVistaPrevia(file);
}

// Crear vista previa mejorada
crearVistaPrevia(file: File) {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.imagenPreview = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Función para mostrar errores (implementar según tu sistema de notificaciones)
mostrarError(mensaje: string) {
  // Ejemplo usando MatSnackBar
  // this.snackBar.open(mensaje, 'Cerrar', {
  //   duration: 5000,
  //   panelClass: ['error-snackbar']
  // });
  console.error(mensaje);
  alert(mensaje); // Temporal - reemplazar con tu sistema de notificaciones
}

// Mejorar la función onFileSelected existente
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.procesarArchivo(file);
  }
}

// Función para limpiar la selección
limpiarSeleccion() {
  this.archivoSeleccionado = null;
  this.imagenPreview = null;
  // Limpiar el input file
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}

}
