import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTotalFacturas(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/facturas/total`);
  }

  getTotalClientes(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/clientes/total`);
  }

  getTotalProductos(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/productos/total`);
  }
}
