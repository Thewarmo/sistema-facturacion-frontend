import { Component, OnInit, ViewChild } from '@angular/core';
import { FacturaService } from '../factura.service';
import { Factura } from '../factura.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-factura-list',
  standalone: true,
  templateUrl: './factura-list.html',
  styleUrls: ['./factura-list.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIcon,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ]
})
export class FacturaListComponent implements OnInit {
  facturas: Factura[] = [];
  dataSource = new MatTableDataSource<Factura>();
  loading = false;
  displayedColumns: string[] = ['numeroFactura', 'cliente', 'fechaEmision', 'total', 'estado', 'acciones'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private facturaService: FacturaService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerFacturas();
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Factura, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.numeroFactura.toString().includes(searchStr) ||
             (data.cliente.nombre + ' ' + data.cliente.apellido).toLowerCase().includes(searchStr) ||
             data.estado.toLowerCase().includes(searchStr) ||
             data.total.toString().includes(searchStr);
    };
  }

  obtenerFacturas(): void {
    this.loading = true;
    this.facturaService.getFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.dataSource.data = data;
      },
      error: (err) => console.error('Error al obtener facturas', err),
      complete: () => this.loading = false
    });
  }
  
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pagada': return 'chip-pagada';
      case 'pendiente': return 'chip-pendiente';
      case 'anulada': return 'chip-anulada';
      default: return 'chip-default';
    }
  }

  irACrearFactura() {
    this.router.navigate(['dashboard/facturas/nueva']);
  }

  irABuscarFactura(){
    this.router.navigate(['dashboard/facturas/buscar']);
  }
  
  irAReportes(){
    this.router.navigate(['dashboard/facturas/reporte']);
  }

}


