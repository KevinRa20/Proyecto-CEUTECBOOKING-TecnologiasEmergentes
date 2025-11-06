import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-estudiante.html',
  styleUrls: ['./login-estudiante.css']
})
export class LoginEstudianteComponent {
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
      const ok = await this.authService.loginEstudiante(this.correo, this.contrasena);

      if (ok) {
        this.mensaje = '✅ Inicio de sesión exitoso';
        setTimeout(() => this.router.navigate(['/formulario-reservacion-estudiante']), 1000);
      } else {
        this.mensaje = '❌ Usuario no registrado. Por favor regístrate.';
        this.mostrarRegistro = true; // muestra registro automáticamente
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
      await this.authService.registrarEstudiante(this.nombre, this.correo, this.contrasena);
      this.mensaje = '✅ Registro exitoso. Ahora puedes iniciar sesión.';
      this.mostrarRegistro = false;
    } catch (error: any) {
      this.mensaje = '❌ Error al registrarse: ' + error.message;
    }
  }

  // Muestra el formulario de registro desde el enlace
  mostrarFormularioRegistro(event: Event) {
    event.preventDefault(); // evita que el enlace recargue la página
    this.mostrarRegistro = true;
    this.mensaje = '';
  }
}
