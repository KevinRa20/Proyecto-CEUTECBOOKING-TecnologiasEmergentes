import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

interface ReservacionDocente {
  nombre: string;
  numeroempleado: string;
  correo: string;
  clase: string;
  seccion: string;
  campus: string;
  sede: string;
  tipoaula: string;
  numeroaula: string;
  fecha: string;
  hora: string;
}

@Component({
  selector: 'app-qrreserva-docente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qrreserva-docente.html',
  styleUrls: ['./qrreserva-docente.css']
})
export class QrreservaDocenteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  reservacion: ReservacionDocente | null = null;
  cargando = true;
  error = false;
  reservacionvalida = false;
  idreservacion = '';

  fechaemision = new Date().toLocaleDateString('es-HN');
  horaemision = new Date().toLocaleTimeString('es-HN');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idreservacion = params['id'];

      if (!this.idreservacion) {
        this.error = true;
        this.cargando = false;
        return;
      }

      this.verificarreservaciondocente(this.idreservacion);
    });
  }

  async verificarreservaciondocente(id: string) {
    try {
      const ref = doc(this.firestore, 'reservas-docentes', id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const d = snap.data();

        this.reservacion = {
          nombre: d?.['nombre'] ?? '',
          numeroempleado: d?.['numeroempleado'] ?? '',
          correo: d?.['correo'] ?? '',
          clase: d?.['clase'] ?? '',
          seccion: d?.['seccion'] ?? '',
          campus: d?.['campus'] ?? '',
          sede: d?.['sede'] ?? '',
          tipoaula: d?.['tipoaula'] ?? '',
          numeroaula: d?.['numeroaula'] ?? '',
          fecha: d?.['fecha'] ?? '',
          hora: d?.['hora'] ?? ''
        };

        this.reservacionvalida = true;
      } else {
        this.reservacionvalida = false;
      }

    } catch (e) {
      console.error('Error verificando QR docente', e);
      this.error = true;
    } finally {
      this.cargando = false;
    }
  }

  volverinicio() {
    window.location.href = '/#/formulario-reservacion-docente';
  }
}