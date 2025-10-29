import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () =>
            import('./components/pagina-bienvenida/pagina-bienvenida').then((m) => m.PaginaBienvenida),
    },
    {
        path: 'Rol',
        loadComponent: () =>
            import('./components/rol/rol').then((m) => m.Rol),
    },
  {
        path: 'FormularioReservacionEstudiante',
        loadComponent: () =>
            import('./components/formulario-reservacion-estudiante/formulario-reservacion-estudiante').then((m) => m.FormularioReservacionEstudiante),
    },
    {
        path: 'FormularioReservacionDocente',
        loadComponent: () =>
            import('./components/formulario-reservacion-docente/formulario-reservacion-docente').then((m) => m.FormularioReservacionDocente),
    },
    {
        path: 'ConfirmacionReservacion',
        loadComponent: () =>
            import('./components/confirmacionde-reservacion/confirmacionde-reservacion').then((m) => m.ConfirmaciondeReservacion),
    },
    {
        path: 'SeleccionarRol',
        loadComponent: () =>
            import('./components/seleccionarrol/seleccionarrol').then((m) => m.Seleccionarrol),
    },
];
