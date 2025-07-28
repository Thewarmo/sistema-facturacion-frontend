import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../factura.service';
import { Factura } from '../factura.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ]
})
export class FacturaListComponent implements OnInit {
  facturas: Factura[] = [];
  loading = false;
  displayedColumns: string[] = ['numeroFactura', 'cliente', 'fechaEmision', 'total', 'estado', 'acciones'];

  constructor(private facturaService: FacturaService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerFacturas();
  }

  obtenerFacturas(): void {
    this.loading = true;
    this.facturaService.getFacturas().subscribe({
      next: (data) => this.facturas = data,
      error: (err) => console.error('Error al obtener facturas', err),
      complete: () => this.loading = false
    });
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


