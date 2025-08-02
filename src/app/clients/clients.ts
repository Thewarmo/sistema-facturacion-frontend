import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class ClientsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'rucCedula', 'email', 'telefono','acciones'];
  clients: Client[] = [];
  dataSource = new MatTableDataSource<Client>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private clientService: ClientService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadClients();
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Client, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.nombre.toLowerCase().includes(searchStr) ||
             data.apellido.toLowerCase().includes(searchStr) ||
             data.email.toLowerCase().includes(searchStr) ||
             data.telefono.toLowerCase().includes(searchStr) ||
             data.rucCedula.toLowerCase().includes(searchStr);
    };
  }

  loadClients(): void {
    this.clientService.getClients().subscribe((data: Client[]) => {
      this.clients = data;
      this.dataSource.data = data;
    });
  }
  
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editClient(client: Client): void {
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
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
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
