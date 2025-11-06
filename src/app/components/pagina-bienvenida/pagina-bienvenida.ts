import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-bienvenida',
  standalone: true,
  templateUrl: './pagina-bienvenida.html',
  styleUrls: ['./pagina-bienvenida.css']
})
export class PaginaBienvenidaComponent {
  constructor(private router: Router) {}
  irAEstudiante() { this.router.navigate(['/login-estudiante']); }
  irADocente() { alert('👨‍🏫 Funcionalidad de docente próximamente.'); }
}
