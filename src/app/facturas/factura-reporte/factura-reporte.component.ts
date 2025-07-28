import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../factura.service';
import { FacturaResponse } from '../factura.model';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-factura-reporte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    NgChartsModule 
  ],
  templateUrl: './factura-reporte.component.html',
  styleUrl: './factura-reporte.component.scss'
})
export class FacturaReporteComponent implements OnInit {
  tipoReporte: 'diario' | 'mensual' | 'anual' = 'diario';
  fechaSeleccionada = new Date();
  facturas: FacturaResponse[] = [];

  // Chart configuration for ng2-charts
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0,
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Ventas por Factura'
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ventas (COP)',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  displayedColumns = ['numeroFactura', 'fechaEmision', 'estado', 'total'];

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {}

  generarReporte() {
    const fecha = this.fechaSeleccionada.toISOString().split('T')[0];
    this.facturaService.getReporte(this.tipoReporte, fecha).subscribe({
      next: (data) => {
        this.facturas = data;
        this.generarGrafico(); // Call chart generation after data is loaded
      },
      error: (err) => console.error('Error al generar reporte', err)
    });
  }

  generarGrafico() {
    // Update chart labels and data
    this.barChartLabels = this.facturas.map(f => f.numeroFactura);
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          data: this.facturas.map(f => f.total),
          label: 'Ventas (COP)',
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  getTotalGeneral(): number {
    return this.facturas.reduce((acc, factura) => acc + factura.total, 0);
  }
}