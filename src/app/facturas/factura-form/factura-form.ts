import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FacturaService } from '../factura.service';
import { ProductoService } from '../../productos/producto.service';
import { ClientService } from '../../clients/cliente-services';
import { Producto } from '../../productos/producto.model';
import { Client } from '../../clients/client.model';
import { MetodoPago } from '../metodo-pago.enum';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-factura-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './factura-form.html',
  styleUrls: ['./factura-form.scss']
})
export class FacturaFormComponent implements OnInit {
  form!: FormGroup;
  productos: Producto[] = [];
  clientes: Client[] = [];
  metodoPagoEnum = MetodoPago;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private productoService: ProductoService,
    private clienteService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cliente: [null, Validators.required],
      metodoPago: [MetodoPago.EFECTIVO, Validators.required],
      detalles: this.fb.array([])
    });

    this.cargarClientes();
    this.cargarProductos();
    this.agregarDetalle(); // Al menos una línea por defecto
  }

  get detalles() {
    return this.form.get('detalles') as FormArray;
  }

  agregarDetalle(): void {
    this.detalles.push(this.fb.group({
      productoId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  eliminarDetalle(index: number): void {
    this.detalles.removeAt(index);
  }

  cargarClientes(): void {
    this.clienteService.getClients().subscribe(data => this.clientes = data);
  }

  cargarProductos(): void {
    this.productoService.getAll().subscribe(data => this.productos = data);
  }

  calcularTotal(): number {
    return this.detalles.controls.reduce((total, detalle) => {
      const producto = this.productos.find(p => p.id === detalle.get('productoId')?.value);
      const cantidad = detalle.get('cantidad')?.value || 0;
      return total + (producto?.precioUnitario || 0) * cantidad;
    }, 0);
  }

  guardar(): void {
    if (this.form.invalid) return;

    const factura = {
      cliente: this.form.value.cliente, 
      metodoPago: this.form.value.metodoPago,
      detalles: this.form.value.detalles.map((detalle: any) => ({
        producto: { id: detalle.productoId },
        cantidad: detalle.cantidad
      }))
    };

    this.facturaService.crearFactura(factura).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Factura creada',
          text: `La factura ${response.numeroFactura} fue registrada correctamente.`,
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['dashboard/facturas']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la factura',
          text: 'Por favor contacte con el administrador.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }



}
