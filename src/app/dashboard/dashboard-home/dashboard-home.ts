import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatMenuModule
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss'
})
export class DashboardHomeComponent implements OnInit {
  totalFacturas = 0;
  totalClientes = 0;
  totalProductos = 0;

  email = "abayona123@gmail.com";

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getTotalFacturas().subscribe({
      next: (total) => (this.totalFacturas = total),
      error: (err) => console.error('Error cargando facturas', err)
    });

    this.dashboardService.getTotalClientes().subscribe({
      next: (total) => (this.totalClientes = total),
      error: (err) => console.error('Error cargando clientes', err)
    });

    this.dashboardService.getTotalProductos().subscribe({
      next: (total) => (this.totalProductos = total),
      error: (err) => console.error('Error cargando productos', err)
    });
  }
}
