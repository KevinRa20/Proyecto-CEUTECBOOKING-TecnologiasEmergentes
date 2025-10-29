import { Component } from '@angular/core';
import { FormularioReservacionEstudiante } from '../formulario-reservacion-estudiante/formulario-reservacion-estudiante';
import { FormularioReservacionDocente } from '../formulario-reservacion-docente/formulario-reservacion-docente';

@Component({
  selector: 'app-seleccionarrol',
  imports: [FormularioReservacionEstudiante, FormularioReservacionDocente],
  templateUrl: './seleccionarrol.html',
  styleUrl: './seleccionarrol.css',
})
export class Seleccionarrol {
 RolEstudiante= 'Ha seleccionado el rol de Estudiante';
 

ObtenerRol():string{
  return this.RolEstudiante;
 
}
CambiarRol(): void{
  this.RolEstudiante= 'Ha seleccionado el rol de Docente';
}
}