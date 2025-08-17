import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { AuthGuard } from './auth/auth-guard';
import { DashboardComponent } from './dashboard/dashboard-component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home';
import { ClientsComponent } from './clients/clients';
import { ProductosComponent } from './productos/productos.component';
import { FacturaFormComponent } from './facturas/factura-form/factura-form';
import { FacturaListComponent } from './facturas/factura-list/factura-list';
import { FacturaDetalleComponent } from './facturas/factura-detalle/factura-detalle';
import { FacturaBuscarComponent } from './facturas/factura-buscar/factura-buscar';
import { FacturaReporteComponent } from './facturas/factura-reporte/factura-reporte.component';
import { ProductoImagenFormComponent } from './productos/producto-imagen-form/producto-imagen-form.component';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
            path: 'dashboard',
            component: DashboardComponent, 
            canActivate: [AuthGuard],
            children: [
                { path: '', component: DashboardHomeComponent },
                { path: 'clients', component: ClientsComponent }, 
                { path: 'productos', component: ProductosComponent },
                { path: 'productos/imagen', component: ProductoImagenFormComponent },
                { path: 'facturas', component: FacturaListComponent },
                { path: 'facturas/nueva', component: FacturaFormComponent },
                { path: 'facturas/buscar', component: FacturaBuscarComponent },
                { path: 'facturas/reporte', component: FacturaReporteComponent },
                { path: 'facturas/:id', component: FacturaDetalleComponent },
                
            ]
        },
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        { path: '**', redirectTo: '/dashboard' }
];
