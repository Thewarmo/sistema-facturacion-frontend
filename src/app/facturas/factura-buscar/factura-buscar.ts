import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FacturaService } from '../factura.service';
import { ClientService } from '../../clients/cliente-services';
import { Client } from '../../clients/client.model';
import { FacturaResponse } from '../factura.model'; // Asegúrate de tener esta interfaz
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-factura-buscar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDivider
  ],
  templateUrl: './factura-buscar.html',
  styleUrls: ['./factura-buscar.scss']
})
export class FacturaBuscarComponent implements OnInit {
  form!: FormGroup;
  clientes: Client[] = [];
  resultados: FacturaResponse[] = [];
  buscando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private clienteService: ClientService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      numeroFactura: [''],
      clienteId: ['']
    });

    this.clienteService.getClients().subscribe(data => this.clientes = data);
  }

  buscar(): void {
    this.resultados = [];
    this.buscando = true;

    const numeroFactura = this.form.value.numeroFactura;
    const clienteId = this.form.value.clienteId;

    if (numeroFactura) {
      this.facturaService.getFacturaById(numeroFactura).subscribe({
        next: factura => {
          this.resultados = [factura];
          this.buscando = false;
        },
        error: () => {
          this.resultados = [];
          this.buscando = false;
        }
      });
    } else if (clienteId) {
      this.facturaService.getFacturasByCliente(clienteId).subscribe({
        next: facturas => {
          this.resultados = facturas;
          this.buscando = false;
        },
        error: () => {
          this.resultados = [];
          this.buscando = false;
        }
      });
    } else {
      this.buscando = false;
    }
  }
}

