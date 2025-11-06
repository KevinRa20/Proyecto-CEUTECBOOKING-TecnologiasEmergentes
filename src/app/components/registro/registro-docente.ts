import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-docente.html',
  styleUrls: ['./registro-docente.css']
})
export class RegistroDocenteComponent {
  nombre = '';
  correo = '';
  contrasena = '';
  mensaje = '';

  constructor(private authService: AuthService, private router: Router) {}

  async registrar() {
    this.mensaje = '';
    try {
      await this.authService.registrarDocente(this.nombre, this.correo, this.contrasena);
      this.mensaje = '✅ Registro exitoso. Ahora inicia sesión.';
      setTimeout(() => this.router.navigate(['/login-docente']), 2000);
    } catch (error: any) {
      this.mensaje = '❌ Error: ' + error.message;
    }
  }
}
