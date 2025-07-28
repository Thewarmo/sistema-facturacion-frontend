export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombreCompleto?: string;
  activo: boolean;
  fechaCreacion?: string;
  roles?: Rol[];
}

export interface Rol {
  id?: number;
  nombre: string;
}
