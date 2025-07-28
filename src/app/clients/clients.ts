import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClientService } from './cliente-services';
import { Client } from './client.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clients',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class ClientsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'rucCedula', 'email', 'telefono','acciones'];
  clients: Client[] = [];

  constructor(private clientService: ClientService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe((data: Client[]) => {
      this.clients = data;
    });
  }

  editClient(client: Client): void {
    // Lógica para editar (la implementaremos después)
    console.log('Edit client:', client);
  }

  deleteClient(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al cliente de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.deleteClient(id).subscribe({
          next: () => {
            this.loadClients();
            Swal.fire('Eliminado', 'El cliente fue eliminado correctamente.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar cliente:', error);
            Swal.fire('Error', 'Ocurrió un error al eliminar el cliente.', 'error');
          },
        });
      }
    });
  }



  openCreateClientDialog(): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '500px', // Ancho del diálogo
      disableClose: true // Evita que se cierre al hacer clic fuera
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients(); // Si el diálogo devuelve un resultado, recargamos la lista
      }
    });
  }

  openEditClientDialog(client: Client) {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '400px',
      data: client
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.updateClient(result).subscribe(() => this.loadClients());
      }
    });
  }

  

}
