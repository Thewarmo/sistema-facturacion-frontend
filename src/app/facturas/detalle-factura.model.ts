import { Producto } from '../productos/producto.model';

export interface DetalleFactura {
  id?: number; // Opcional si el backend lo genera
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  total: number;
}
