import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FacturaService } from '../factura.service';
import { Factura, FacturaResponse } from '../factura.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

// Importar jsPDF
import jsPDF from 'jspdf';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './factura-detalle.html',
  styleUrls: ['./factura-detalle.scss']
})
export class FacturaDetalleComponent implements OnInit {
  factura?: FacturaResponse;
  cargando = true;
  procesandoPago = false;
  displayedColumns: string[] = ['producto', 'cantidad', 'precioUnitario', 'subtotal'];

  constructor(
    private route: ActivatedRoute,
    private facturaService: FacturaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facturaService.getFacturaById(+id).subscribe({
        next: (data) => this.factura = data,
        error: (err) => {
          console.error('Error al cargar factura', err);
          this.snackBar.open('Error al cargar la factura', 'Cerrar', { duration: 3000 });
        },
        complete: () => this.cargando = false
      });
    }
  }

  calcularSubtotal(detalle: any): number {
    return detalle.producto?.precioUnitario * detalle.cantidad;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'PAGADA':
        return 'primary';
      case 'PENDIENTE':
        return 'warn';
      case 'ANULADA':
        return 'accent';
      default:
        return 'primary';
    }
  }

  generarPDF(): void {
    if (!this.factura) return;

    try {
      const doc = new jsPDF();
      
      // Configurar fuente
      doc.setFont('helvetica');
      
      // Título y encabezado
      doc.setFontSize(20);
      doc.setTextColor(33, 150, 243); // Azul Material
      doc.text('FACTURA', 20, 30);
      
      // Información de la factura
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Factura #${this.factura.numeroFactura}`, 140, 25);
      doc.text(`Estado: ${this.factura.estado}`, 140, 35);
      doc.text(`Fecha: ${this.formatearFecha(this.factura.fechaEmision)}`, 140, 45);
      
      // Línea separadora
      doc.setDrawColor(33, 150, 243);
      doc.line(20, 50, 190, 50);
      
      // Información del cliente
      doc.setFontSize(14);
      doc.setTextColor(33, 150, 243);
      doc.text('INFORMACIÓN DEL CLIENTE', 20, 65);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      let yPos = 75;
      doc.text(`Nombre: ${this.factura.cliente.nombre}`, 20, yPos);
      
      if (this.factura.cliente.email) {
        yPos += 7;
        doc.text(`Email: ${this.factura.cliente.email}`, 20, yPos);
      }
      
      if (this.factura.cliente.telefono) {
        yPos += 7;
        doc.text(`Teléfono: ${this.factura.cliente.telefono}`, 20, yPos);
      }
      
      if (this.factura.cliente.rucCedula) {
        yPos += 7;
        doc.text(`RUC/Cédula: ${this.factura.cliente.rucCedula}`, 20, yPos);
      }
      
      // Tabla de productos (manual)
      yPos += 20;
      
      // Encabezados de la tabla
      doc.setFontSize(12);
      doc.setTextColor(33, 150, 243);
      doc.text('DETALLE DE PRODUCTOS', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(33, 150, 243);
      doc.rect(20, yPos, 170, 8, 'F');
      
      // Textos del encabezado
      doc.text('Producto', 22, yPos + 5);
      doc.text('Cant.', 110, yPos + 5);
      doc.text('Precio Unit.', 130, yPos + 5);
      doc.text('Subtotal', 165, yPos + 5);
      
      yPos += 8;
      
      // Filas de productos
      doc.setTextColor(0, 0, 0);
      this.factura.detalles.forEach((detalle, index) => {
        yPos += 8;
        
        // Alternar color de fondo
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(20, yPos - 3, 170, 8, 'F');
        }
        
        // Textos de la fila
        doc.text(detalle.producto.nombre.substring(0, 30), 22, yPos + 2);
        doc.text(detalle.cantidad.toString(), 115, yPos + 2);
        doc.text(this.formatearMoneda(detalle.producto.precioUnitario), 135, yPos + 2);
        doc.text(this.formatearMoneda(this.calcularSubtotal(detalle)), 165, yPos + 2);
        
        // Si el nombre es muy largo, agregar línea extra
        if (detalle.producto.nombre.length > 30) {
          yPos += 6;
          doc.text(detalle.producto.nombre.substring(30), 22, yPos + 2);
        }
      });
      
      // Totales
      yPos += 20;
      const totalesX = 130;
      
      doc.setFontSize(10);
      doc.text('Subtotal:', totalesX, yPos);
      doc.text(this.formatearMoneda(this.factura.subtotal), 165, yPos);
      
      yPos += 7;
      doc.text('Impuestos:', totalesX, yPos);
      doc.text(this.formatearMoneda(this.factura.totalImpuestos), 165, yPos);
      
      // Total final
      yPos += 10;
      doc.setDrawColor(0, 0, 0);
      doc.line(totalesX, yPos - 2, 190, yPos - 2);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL:', totalesX, yPos + 3);
      doc.text(this.formatearMoneda(this.factura.total), 165, yPos + 3);
      
      // Descargar el PDF
      doc.save(`factura-${this.factura.numeroFactura}.pdf`);
      
      this.snackBar.open('PDF generado exitosamente', 'Cerrar', { duration: 3000 });
      
    } catch (error) {
      console.error('Error al generar PDF', error);
      this.snackBar.open('Error al generar el PDF', 'Cerrar', { duration: 3000 });
    }
  }

  private formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  }

  private formatearFecha(fecha: string | Date): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  pagarFactura(): void {
  if (!this.factura || this.procesandoPago) return;

  const pago = {
    monto: this.factura.total, // o puedes usar un campo editable
    metodoPago: 'EFECTIVO',    // cambia por el valor real que elija el usuario
    referencia: 'Caja Principal', // también configurable
    factura: {
      id: this.factura.id
    }
  };

  this.procesandoPago = true;

  this.facturaService.pagarFactura(pago).subscribe({
      next: (facturaActualizada) => {
        this.factura = facturaActualizada;

        Swal.fire({
          title: '¡Factura pagada exitosamente!',
          text: 'La ventana se cerrará en 10 segundos.',
          icon: 'success',
          timer: 10000,
          timerProgressBar: true,
          showConfirmButton: false,
          didClose: () => {
            window.location.reload();
          }
        });
      },
      error: (err) => {
        console.error('Error al pagar factura', err);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al procesar el pago.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      },
      complete: () => this.procesandoPago = false
    });
  }

  anularFactura(): void {
    if (!this.factura) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción anulará la factura de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.anularFactura(this.factura!.id).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Factura anulada!',
              text: 'La ventana se cerrará en 10 segundos.',
              icon: 'success',
              timer: 10000,
              timerProgressBar: true,
              showConfirmButton: false,
              didClose: () => {
                window.location.reload();
              }
            });
          },
          error: (err) => {
            console.error('Error al anular factura', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo anular la factura.',
              icon: 'error',
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }

}