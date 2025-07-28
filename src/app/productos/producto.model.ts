export interface Producto {
    id?: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  precioUnitario: number;
  stock?: number;
  tipoItem: TipoItem;
  categoriaId?: number;
}

export enum TipoItem {
  PRODUCTO = 'PRODUCTO',
  SERVICIO = 'SERVICIO'
}

