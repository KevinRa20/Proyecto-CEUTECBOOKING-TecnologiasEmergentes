import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-estudiante.html',
  styleUrls: ['./registro-estudiante.css']
})
export class RegistroEstudianteComponent {
  nombre = '';
  correo = '';
  contrasena = '';
  mensaje = '';

  constructor(private authService: AuthService, private router: Router) {}

  async registrar() {
    this.mensaje = '';
    try {
      await this.authService.registrarEstudiante(this.nombre, this.correo, this.contrasena);
      this.mensaje = '✅ Registro exitoso. Ahora inicia sesión.';
      setTimeout(() => this.router.navigate(['/login-estudiante']), 2000);
    } catch (error: any) {
      this.mensaje = '❌ Error: ' + error.message;
    }
  }
}
