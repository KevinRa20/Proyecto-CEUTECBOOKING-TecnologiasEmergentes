import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';

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
  selector: 'app-formulario-reservacion-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-reservacion-docente.html',
  styleUrls: ['./formulario-reservacion-docente.css']
})
export class FormularioReservacionDocenteComponent implements OnInit {
  // Variables del formulario
  nombre = '';
  numeroempleado = '';
  correo = '';
  clase = '';
  seccion = '';
  campus = '';
  sede = '';
  tipoaula = '';
  numeroaula = '';
  fecha = '';
  hora = '';

  // Variables de estado
  resumen: ReservacionDocente | null = null;
  qrDataUrl = '';
  docId: string | null = null;
  cargando = false;
  reservacionConfirmada = false;
  confirmando = false;
  qrGenerado = false;
  qrCargado = false;
  generandoQR = false;
  errorQR = false;

  // Fechas de emisión
  fechaEmision = new Date().toLocaleDateString();
  horaEmision = new Date().toLocaleTimeString();

  // Firestore
  firestore: Firestore = inject(Firestore);

  // Opciones del formulario
  campusOpciones = [
    'Unitec Tegucigalpa', 'Unitec San Pedro Sula', 'Ceutec Tegucigalpa', 'Ceutec La Ceiba',
    'Ceutec San Pedro Sula', 'Universidad Virtual', 'Unitec Teledocencia', 'Ceutec Teledocencia'
  ];

  horasDisponibles = ['8:00 AM', '9:30 AM', '11:00 AM', '12:30 PM', '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM', '8:00 PM', '9:30 PM'];
  horasOcupadas: string[] = [];

  ngOnInit() { }

  async cargarHorasOcupadas() {
    if (!this.fecha || !this.campus || !this.tipoaula || !this.numeroaula) {
      this.horasOcupadas = [];
      return;
    }

    this.cargando = true;
    try {
      const reservasRef = collection(this.firestore, 'reservas-docentes');
      const q = query(
        reservasRef,
        where('campus', '==', this.campus),
        where('tipoaula', '==', this.tipoaula),
        where('numeroaula', '==', this.numeroaula),
        where('fecha', '==', this.fecha)
      );
      const snapshot = await getDocs(q);
      this.horasOcupadas = snapshot.docs.map(doc => (doc.data() as { hora: string }).hora);
    } catch (error) {
      console.error('Error cargando horas ocupadas:', error);
      this.horasOcupadas = [];
    } finally {
      this.cargando = false;
    }
  }

  aceptarReservacion() {
    if (!this.nombre || !this.numeroempleado || !this.correo) {
      alert('Complete campos obligatorios');
      return;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.edu(\.[a-z]{2,})?$/i;
    if (!correoRegex.test(this.correo)) {
      alert('Correo debe ser educativo');
      return;
    }

    if (!this.hora) {
      alert('Seleccione una hora');
      return;
    }

    if (this.horasOcupadas.includes(this.hora)) {
      alert('La hora seleccionada no está disponible. Por favor seleccione otra hora.');
      return;
    }

    this.resumen = {
      nombre: this.nombre,
      numeroempleado: this.numeroempleado,
      correo: this.correo,
      clase: this.clase,
      seccion: this.seccion,
      campus: this.campus,
      sede: this.sede,
      tipoaula: this.tipoaula,
      numeroaula: this.numeroaula,
      fecha: this.fecha,
      hora: this.hora
    };
  }

  async confirmarReservacion() {
    if (!this.resumen) return;

    this.confirmando = true;
    this.errorQR = false;

    try {
      await this.cargarHorasOcupadas();

      if (this.horasOcupadas.includes(this.resumen.hora)) {
        alert('La hora seleccionada ya no está disponible. Por favor seleccione otra hora.');
        this.actualizarReservacion();
        return;
      }

      const reservasRef = collection(this.firestore, 'reservas-docentes');
      if (this.docId) {
        await setDoc(doc(this.firestore, 'reservas-docentes', this.docId), this.resumen);
      } else {
        const docRef = await addDoc(reservasRef, this.resumen);
        this.docId = docRef.id;
      }

      await this.generarQRConURL();

      this.reservacionConfirmada = true;
      this.qrGenerado = true;

    } catch (e) {
      console.error('Error al confirmar:', e);
      alert('Error al confirmar la reservación');
      this.errorQR = true;
    } finally {
      this.confirmando = false;
    }
  }

  private async generarQRConURL(): Promise<void> {
    if (!this.resumen || !this.docId) return;

    this.generandoQR = true;
    this.qrCargado = false;
    this.errorQR = false;

    try {
      const qrURL = `https://ceutecbooking-980dd.web.app/#/qrreserva-docente?id=${this.docId}`;

      let QRCode: any;
      try {
        const QRCodeModule = await import('qrcode');
        QRCode = QRCodeModule.default || QRCodeModule;
      } catch (importError) {
        throw new Error('No se pudo cargar la librería QRCode');
      }

      this.qrDataUrl = await QRCode.toDataURL(qrURL, {
        width: 200,
        margin: 1,
        color: { dark: '#000000', light: '#FFFFFF' },
        errorCorrectionLevel: 'M'
      });

    } catch (error) {
      console.error('Error generando QR:', error);
      this.errorQR = true;
      this.generarQRRespaldoSimple();
    } finally {
      this.generandoQR = false;
    }
  }

  private generarQRRespaldoSimple(): void {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo obtener contexto canvas');
      }

      canvas.width = 200;
      canvas.height = 200;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('QR NO DISPONIBLE', canvas.width / 2, canvas.height / 2);

      this.qrDataUrl = canvas.toDataURL();
      this.qrCargado = true;

    } catch (error) {
      console.error('Error generando QR de respaldo:', error);
      this.qrDataUrl = '';
      this.errorQR = true;
    }
  }

  onQRLoaded() {
    this.qrCargado = true;
    this.errorQR = false;
  }

  onQRError() {
    this.qrCargado = false;
    this.errorQR = true;
  }

  async regenerarQR() {
    this.qrDataUrl = '';
    this.qrCargado = false;
    this.errorQR = false;

    await new Promise(resolve => setTimeout(resolve, 500));
    await this.generarQRConURL();
  }

  actualizarReservacion() {
    if (!this.resumen) return;
    Object.assign(this, { ...this.resumen });
    this.resumen = null;
    this.reservacionConfirmada = false;
    this.qrGenerado = false;
    this.qrDataUrl = '';
    this.qrCargado = false;
    this.errorQR = false;
  }

  async cancelarReservacion() {
    if (confirm('¿Está seguro de que desea cancelar esta reservación?')) {
      try {
        if (this.docId) {
          await deleteDoc(doc(this.firestore, 'reservas-docentes', this.docId));
        }

        this.limpiarFormulario();
        alert('Reservación cancelada exitosamente');

      } catch (e) {
        console.error(e);
        alert('Error al cancelar la reservación');
      }
    }
  }

  private limpiarFormulario() {
    this.resumen = null;
    this.qrDataUrl = '';
    this.docId = null;
    this.nombre = '';
    this.numeroempleado = '';
    this.correo = '';
    this.clase = '';
    this.seccion = '';
    this.campus = '';
    this.sede = '';
    this.tipoaula = '';
    this.numeroaula = '';
    this.fecha = '';
    this.hora = '';
    this.qrGenerado = false;
    this.qrCargado = false;
    this.errorQR = false;
    this.reservacionConfirmada = false;
  }

  esHoraDisponible(hora: string): boolean {
    return !this.horasOcupadas.includes(hora);
  }

  getClaseHora(hora: string): string {
    return this.esHoraDisponible(hora) ? '' : 'hora-ocupada';
  }

  esHoraDeshabilitada(hora: string): boolean {
    return !this.esHoraDisponible(hora);
  }

  get resumenItems() {
    if (!this.resumen) return [];

    return [
      { label: 'Nombre', value: this.resumen.nombre, icon: 'fas fa-user azul' },
      { label: 'Número de Empleado', value: this.resumen.numeroempleado, icon: 'fas fa-id-card rojo' },
      { label: 'Correo', value: this.resumen.correo, icon: 'fas fa-envelope azul' },
      { label: 'Clase', value: this.resumen.clase, icon: 'fas fa-graduation-cap beige' },
      { label: 'Sección', value: this.resumen.seccion, icon: 'fas fa-graduation-cap azul' },
      { label: 'Campus', value: this.resumen.campus, icon: 'fas fa-university azul' },
      { label: 'Sede', value: this.resumen.sede || 'No especificada', icon: 'fas fa-map-marker-alt rojo' },
      { label: 'Tipo de aula', value: this.resumen.tipoaula, icon: 'fas fa-chalkboard beige' },
      { label: 'Número de aula', value: this.resumen.numeroaula, icon: 'fas fa-door-open beige' },
      { label: 'Fecha reservación', value: this.resumen.fecha, icon: 'fas fa-calendar-alt azul' },
      { label: 'Hora reservación', value: this.resumen.hora + ' (1.5 h)', icon: 'fas fa-clock rojo' }
    ];
  }
}
