import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-docente.html',
  styleUrls: ['./login-docente.css']
})
export class LoginDocenteComponent {
  correo = '';
  contrasena = '';
  nombre = '';
  mensaje = '';
  mostrarRegistro = false;

  constructor(private authService: AuthService, private router: Router) {}

  // LOGIN
  async login() {
    this.mensaje = '';

    // ✅ Validar correo educativo
    if (!this.correo.endsWith('.edu')) {
      this.mensaje = '❌ Debes usar un correo educativo válido (.edu)';
      return;
    }

    try {
      const ok = await this.authService.loginDocente(this.correo, this.contrasena);

      if (ok) {
        this.mensaje = '✅ Inicio de sesión exitoso';
        setTimeout(() => this.router.navigate(['/formulario-reservacion-docente']), 1000);
      } else {
        this.mensaje = '❌ Usuario no registrado. Por favor regístrate.';
        this.mostrarRegistro = true;
      }
    } catch (error: any) {
      this.mensaje = '⚠️ Error al iniciar sesión: ' + error.message;
    }
  }

  // REGISTRO
  async registrar() {
    this.mensaje = '';

    // ✅ Validar correo educativo
    if (!this.correo.endsWith('.edu')) {
      this.mensaje = '❌ Solo se permiten correos educativos (.edu)';
      return;
    }

    try {
      const ok = await this.authService.loginEstudiante(this.correo, this.contrasena);

      if (ok) {
        this.mensaje = '✅ Inicio de sesión exitoso';
        setTimeout(() => this.router.navigate(['/formulario-reservacion-docente']), 1000);
      } else {
        this.mensaje = '❌ Usuario no registrado. Por favor regístrate.';
        this.mostrarRegistro = true; // muestra registro automáticamente
      }
    } catch (error: any) {
      this.mensaje = '⚠️ Error al iniciar sesión: ' + error.message;
    }
  }

  // Muestra el formulario de registro desde el enlace
  mostrarFormularioRegistro(event: Event) {
    event.preventDefault();
    this.mostrarRegistro = true;
    this.mensaje = '';
  }
}
