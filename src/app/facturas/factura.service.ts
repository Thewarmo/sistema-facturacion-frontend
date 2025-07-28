import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura, FacturaResponse } from './factura.model';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = `${environment.apiUrl}/facturas`;

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }

  getFacturaById(id: number): Observable<FacturaResponse> {
    return this.http.get<FacturaResponse>(`${this.apiUrl}/${id}`);
  }

  getFacturasByCliente(clienteId: number): Observable<FacturaResponse[]> {
  return this.http.get<FacturaResponse[]>(`${this.apiUrl}/cliente/${clienteId}`);
}

  crearFactura(factura: Partial<Factura>): Observable<Factura> {
    return this.http.post<Factura>(this.apiUrl, factura);
  }

  actualizarFactura(id: number, factura: Partial<Factura>): Observable<Factura> {
    return this.http.put<Factura>(`${this.apiUrl}/${id}`, factura);
  }

  anularFactura(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/anular`, {});
  }

  pagarFactura(pago: {
    monto: number;
    metodoPago: string;
    referencia: string;
    factura: { id: number };
  }): Observable<FacturaResponse> {
    return this.http.post<FacturaResponse>(`${environment.apiUrl}/pagos`, pago);
  }


  generarPDF(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }

  getReporte(tipo: 'diario' | 'mensual' | 'anual', fecha: string): Observable<FacturaResponse[]> {
    // Ensure the date is in the correct format (YYYY-MM-DD)
    const formattedDate = new Date(fecha).toISOString().split('T')[0];
    
    return this.http.get<FacturaResponse[]>(`${this.apiUrl}/reportes/${tipo}?fecha=${formattedDate}`)
      .pipe(
        catchError((error) => {
          console.error('Error generating report:', error);
          throw error;
        })
      );
  }
  
}
