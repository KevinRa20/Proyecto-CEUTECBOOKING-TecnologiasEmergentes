import { Routes } from '@angular/router';
import { PaginaBienvenidaComponent } from './components/pagina-bienvenida/pagina-bienvenida';
import { LoginEstudianteComponent } from './login/login-estudiante';
import { RegistroEstudianteComponent } from './components/registro/registro-estudiante';
import { FormularioReservacionEstudianteComponent } from './components/formulario-reservacion-estudiante/formulario-reservacion-estudiante';

export const routes: Routes = [
  { path: '', component: PaginaBienvenidaComponent },          // Página de bienvenida
  { path: 'login-estudiante', component: LoginEstudianteComponent },
  { path: 'registro-estudiante', component: RegistroEstudianteComponent },
  { path: 'formulario-reservacion-estudiante', component: FormularioReservacionEstudianteComponent } // Formulario
];
