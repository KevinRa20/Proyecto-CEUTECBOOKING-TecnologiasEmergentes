import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  login() {
    console.log('Docente:', this.correo, this.contrasena);
    // Aquí iría Firebase auth
  }
}
