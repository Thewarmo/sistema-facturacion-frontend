import { EstadoFactura } from './estado-factura.enum';
import { MetodoPago } from './metodo-pago.enum';
import { Client } from '../clients/client.model';
import { Usuario } from '../auth/user.model';
import { DetalleFactura } from '../facturas/detalle-factura.model';
import { Producto } from '../productos/producto.model';

export interface Factura {
  id: number;
  numeroFactura: string;
  fechaEmision: string; // ISO string
  estado: EstadoFactura;
  subtotal: number;
  totalImpuestos: number;
  total: number;
  cliente: Client;
  usuario: Usuario;
  detalles: DetalleFactura[];
}

export interface DetalleFacturaResponse {
  id: number;
  cantidad: number;
  precioUnitario: number;
  subtotalLinea: number;
  producto: Producto;
}

export interface FacturaResponse {
  id: number;
  numeroFactura: string;
  fechaEmision: string;
  estado: string;
  subtotal: number;
  totalImpuestos: number;
  total: number;
  cliente: Client;
  detalles: DetalleFacturaResponse[];
}
