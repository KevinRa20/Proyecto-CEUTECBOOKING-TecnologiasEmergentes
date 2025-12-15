import { Component } from '@angular/core';
import { PwaService } from '../../services/pwa.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offline.component.html',

})
export class OfflineComponent {
  constructor(
    public pwaService: PwaService,
    private router: Router
  ) {}

  reintentarConexion(): void {
    if (navigator.onLine) {
      this.router.navigate(['/']);
    } else {
      // Mostrar mensaje de que aún no hay conexión
      alert('Aún no hay conexión a internet disponible.');
    }
  }

  salirAplicacion(): void {
    if (this.pwaService.isPwaInstalled()) {
      // Cerrar la aplicación PWA
      if (window.navigator && (window.navigator as any).app) {
        (window.navigator as any).app.exitApp();
      }
    }
  }
}