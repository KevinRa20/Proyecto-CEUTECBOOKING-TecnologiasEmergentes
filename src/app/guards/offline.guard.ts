import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PwaService } from '../services/pwa.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineGuard implements CanActivate {
  constructor(private pwaService: PwaService, private router: Router) {}

  canActivate(): boolean {
    if (!navigator.onLine) {
      // Redirigir a página offline
      this.router.navigate(['/offline']);
      return false;
    }
    return true;
  }
}