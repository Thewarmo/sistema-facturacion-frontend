import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

    private apiUrl = `${environment.apiUrl}/clientes`;

    constructor(private http: HttpClient) { }

    getClients(): Observable<Client[]> {
        console.log(this.apiUrl);
        return this.http.get<Client[]>(this.apiUrl);
    }
    
    getClient(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.apiUrl}/${id}`);
    }

    createClient(client: Client): Observable<Client> {
        return this.http.post<Client>(this.apiUrl, client);
    }

    updateClient(client: Client): Observable<Client> {
        return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client);
    }

    deleteClient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
