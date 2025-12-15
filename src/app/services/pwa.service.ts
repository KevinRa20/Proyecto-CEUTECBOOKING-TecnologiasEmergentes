import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { Subject, Observable } from 'rxjs';

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private promptEvent: any;
  private installPrompt = new Subject<void>();
  private updateAvailable = new Subject<void>();
  private isOffline = new Subject<boolean>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private updates: SwUpdate
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initPwa();
    }
  }

  private initPwa(): void {
    // Detectar evento de instalación PWA
    window.addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault();
      this.promptEvent = event;
      this.installPrompt.next();
      this.showCustomInstallPrompt();
    });

    // Detectar cambios online/offline
    window.addEventListener('online', () => {
      this.isOffline.next(false);
      this.hideCustomOfflineMessage();
    });

    window.addEventListener('offline', () => {
      this.isOffline.next(true);
      this.showCustomOfflineMessage();
    });

    // Manejar actualizaciones del service worker
    if (this.updates.isEnabled) {
      this.updates.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          this.updateAvailable.next();
          this.showCustomUpdatePrompt();
        }
      });

      // Verificar actualizaciones periódicamente
      setInterval(() => {
        this.updates.checkForUpdate();
      }, 60 * 60 * 1000); // Cada hora
    }
  }

  // Método para mostrar prompt de instalación personalizado
  private showCustomInstallPrompt(): void {
    if (this.promptEvent) {
      const promptElement = document.getElementById('pwa-install-prompt');
      if (promptElement) {
        promptElement.style.display = 'block';
        
        // Configurar botones
        const installBtn = document.getElementById('pwa-install-accept');
        const cancelBtn = document.getElementById('pwa-install-cancel');
        
        if (installBtn) {
          installBtn.onclick = () => this.installPwa();
        }
        
        if (cancelBtn) {
          cancelBtn.onclick = () => this.hideCustomInstallPrompt();
        }
      }
    }
  }

  private hideCustomInstallPrompt(): void {
    const promptElement = document.getElementById('pwa-install-prompt');
    if (promptElement) {
      promptElement.style.display = 'none';
    }
  }

  // Método para mostrar mensaje offline personalizado
  private showCustomOfflineMessage(): void {
    const offlineElement = document.getElementById('offline-message');
    if (offlineElement) {
      offlineElement.style.display = 'block';
      
      // Ocultar automáticamente después de 5 segundos si vuelve online
      setTimeout(() => {
        if (navigator.onLine) {
          this.hideCustomOfflineMessage();
        }
      }, 5000);
    }
  }

  private hideCustomOfflineMessage(): void {
    const offlineElement = document.getElementById('offline-message');
    if (offlineElement) {
      offlineElement.style.display = 'none';
    }
  }

  // Método para mostrar prompt de actualización personalizado
  private showCustomUpdatePrompt(): void {
    const updateElement = document.getElementById('update-available');
    if (updateElement) {
      updateElement.style.display = 'block';
      
      // Configurar botón de recarga
      const reloadBtn = document.getElementById('update-reload');
      if (reloadBtn) {
        reloadBtn.onclick = () => this.activateUpdate();
      }
    }
  }

  // Instalar PWA
  installPwa(): void {
    if (this.promptEvent) {
      this.promptEvent.prompt();
      this.promptEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuario aceptó la instalación PWA');
          this.showNotification('Aplicación instalada correctamente', 'success');
        } else {
          console.log('Usuario rechazó la instalación PWA');
        }
        this.promptEvent = null;
        this.hideCustomInstallPrompt();
      });
    }
  }

  // Activar actualización
  activateUpdate(): void {
    this.updates.activateUpdate().then(() => {
      document.location.reload();
    });
  }

  // Verificar si es PWA instalada
  isPwaInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  // Verificar si se puede instalar PWA
  canInstallPwa(): boolean {
    return !!this.promptEvent;
  }

  // Verificar si hay conexión
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Obtener observables
  getInstallPrompt(): Observable<void> {
    return this.installPrompt.asObservable();
  }

  getUpdateAvailable(): Observable<void> {
    return this.updateAvailable.asObservable();
  }

  getOnlineStatus(): Observable<boolean> {
    return this.isOffline.asObservable();
  }

  // Verificar actualizaciones manualmente
  checkForUpdate(): void {
    if (this.updates.isEnabled) {
      this.updates.checkForUpdate();
    }
  }

  // Mostrar notificación personalizada
  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Reiniciar verificación de PWA
  restartPwaCheck(): void {
    this.promptEvent = null;
    this.initPwa();
  }
}