import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from './producto.service';
import { Producto } from './producto.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductoDialogComponent } from './producto-dialog/producto-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule

  ],
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  private service = inject(ProductoService);
  private dialog = inject(MatDialog);
  productos: Producto[] = [];
  columnas: string[] = ['nombre', 'tipoItem', 'precioUnitario', 'acciones'];


  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.service.getAll().subscribe(productos => this.productos = productos);
  }

  abrirDialog(producto?: Producto): void {
    const ref = this.dialog.open(ProductoDialogComponent, {
      data: producto || {},
      width: '500px'
    });

    ref.afterClosed().subscribe(res => {
      if (res) this.loadProductos();
    });
  }

  eliminar(id: number): void {
    Swal.fire({
        icon: 'info',
        title: 'Eliminacion producto',
        text: '¿Seguro de eliminar este producto?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.delete(id).subscribe(() => this.loadProductos());
        }
      });
  }
}

