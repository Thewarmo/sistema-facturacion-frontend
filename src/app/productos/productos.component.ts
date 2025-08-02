import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from './producto.service';
import { Producto } from './producto.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductoDialogComponent } from './producto-dialog/producto-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  private service = inject(ProductoService);
  private dialog = inject(MatDialog);
  
  productos: Producto[] = [];
  dataSource = new MatTableDataSource<Producto>();
  columnas: string[] = ['nombre', 'tipoItem', 'precioUnitario', 'acciones'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadProductos();
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Producto, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.nombre.toLowerCase().includes(searchStr) ||
             data.tipoItem.toLowerCase().includes(searchStr) ||
             data.precioUnitario.toString().includes(searchStr);
    };
  }

  loadProductos(): void {
    this.service.getAll().subscribe(productos => {
      this.productos = productos;
      this.dataSource.data = productos;
    });
  }
  
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

