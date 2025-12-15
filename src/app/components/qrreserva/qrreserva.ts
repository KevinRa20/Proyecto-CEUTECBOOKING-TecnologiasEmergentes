import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

interface Reservacion {
  nombre: string;
  numeroCuenta: string;
  correo: string;
  otrosEstudiantes: string[];
  campus: string;
  sede: string;
  tipoAula: string;
  numeroaula: string;
  fecha: string;
  hora: string;
}

@Component({
  selector: 'app-qrreserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qrreserva.html',
  styleUrls: ['./qrreserva.css']
})
export class QrreservaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  
  reservacion: Reservacion | null = null;
  cargando = true;
  error = false;
  reservacionValida = false;
  idReservacion: string = '';

  fechaEmision = new Date().toLocaleDateString('es-HN');
  horaEmision = new Date().toLocaleTimeString('es-HN');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idReservacion = params['id'];
      if (this.idReservacion) {
        this.verificarReservacion(this.idReservacion);
      } else {
        this.error = true;
        this.cargando = false;
      }
    });
  }

  async verificarReservacion(id: string) {
    try {
      const docRef = doc(this.firestore, 'reservas', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.reservacion = docSnap.data() as Reservacion;
        this.reservacionValida = true;
      } else {
        this.reservacionValida = false;
      }
    } catch (error) {
      console.error('Error verificando reservación:', error);
      this.error = true;
    } finally {
      this.cargando = false;
    }
  }

  onImageError(event: any) {
    console.log('Error cargando imagen');
    event.target.style.display = 'none';
  }

  volverInicio() {
    window.location.href = '/#/formulario-reservacion-estudiante';
  }
}
