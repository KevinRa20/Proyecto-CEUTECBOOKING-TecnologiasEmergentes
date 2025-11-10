import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-formulario-reservacion-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-reservacion-estudiante.html',
  styleUrls: ['./formulario-reservacion-estudiante.css']
})
export class FormularioReservacionEstudianteComponent implements OnInit {

  nombre = '';
  numeroCuenta = '';
  correo = '';
  otrosEstudiantes: string[] = [];
  campus = '';
  sede = '';
  tipoAula = '';
  numeroaula = '';
  fecha = '';
  hora = '';
  resumen: any = null;
  qrDataUrl = '';
  docId: string | null = null;

  firestore: Firestore = inject(Firestore);

  campusOpciones = [
    'Unitec Tegucigalpa',
    'Unitec San Pedro Sula',
    'Ceutec Tegucigalpa',
    'Ceutec La Ceiba',
    'Ceutec San Pedro Sula',
    'Universidad Virtual',
    'Unitec Teledocencia',
    'Ceutec Teledocencia'
  ];

  horasDisponibles = [
    '8:00 AM','9:30 AM','11:00 AM','12:30 PM','2:00 PM','3:30 PM','5:00 PM','6:30 PM','8:00 PM','9:30 PM'
  ];

  horasOcupadas: string[] = [];

  ngOnInit() {}

  agregarEstudiante(nombre: string) {
    if (nombre && !this.otrosEstudiantes.includes(nombre)) this.otrosEstudiantes.push(nombre);
  }

  async cargarHorasOcupadas() {
    if (!this.fecha || !this.campus || !this.tipoAula || !this.numeroaula || !this.sede) return;

    const reservasRef = collection(this.firestore, 'reservas');
    const q = query(
      reservasRef,
      where('campus', '==', this.campus),
      where('sede', '==', this.sede),
      where('tipoAula', '==', this.tipoAula),
      where('numeroaula', '==', this.numeroaula),
      where('fecha', '==', this.fecha)
    );

    const snapshot = await getDocs(q);
    this.horasOcupadas = snapshot.docs
      .filter(doc => doc.id !== this.docId)
      .map(doc => (doc.data() as { hora: string }).hora);
  }

  aceptarReservacion() {
    if (!this.nombre || !this.numeroCuenta || !this.correo) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.edu(\.[a-z]{2,})?$/i;
    if (!correoRegex.test(this.correo)) {
      alert('❌ El correo debe ser educativo (.edu)');
      return;
    }

    if (this.horasOcupadas.includes(this.hora)) {
      alert('❌ Esta hora ya está reservada. Elija otra.');
      return;
    }

    this.resumen = {
      nombre: this.nombre,
      numeroCuenta: this.numeroCuenta,
      correo: this.correo,
      otrosEstudiantes: this.otrosEstudiantes,
      campus: this.campus,
      sede: this.sede,
      tipoAula: this.tipoAula,
      numeroaula: this.numeroaula,
      fecha: this.fecha,
      hora: this.hora
    };
  }

  async confirmarReservacion() {
    if (!this.resumen) return;

    try {
      const reservasRef = collection(this.firestore, 'reservas');

      if (this.docId) {
        const docRef = doc(this.firestore, 'reservas', this.docId);
        await setDoc(docRef, this.resumen);
      } else {
        const docRef = await addDoc(reservasRef, this.resumen);
        this.docId = docRef.id;
      }

      const qrTexto = `
Nombre: ${this.resumen.nombre}
Número de cuenta: ${this.resumen.numeroCuenta}
Correo: ${this.resumen.correo}
Otros estudiantes: ${this.resumen.otrosEstudiantes.join(', ')}
Campus: ${this.resumen.campus}
Sede: ${this.resumen.sede}
Tipo de aula: ${this.resumen.tipoAula}
Número de aula: ${this.resumen.numeroaula}
Fecha: ${this.resumen.fecha}
Hora: ${this.resumen.hora} (1.5 h)
      `;

      const QRCodeModule: any = await import('qrcode');
      this.qrDataUrl = await QRCodeModule.toDataURL(qrTexto);

      alert('✅ Reservación confirmada y QR generado');
      await this.cargarHorasOcupadas();
    } catch (error) {
      console.error('Error al guardar reservación', error);
    }
  }

  async actualizarReservacion() {
    if (!this.resumen) return;

    this.nombre = this.resumen.nombre;
    this.numeroCuenta = this.resumen.numeroCuenta;
    this.correo = this.resumen.correo;
    this.otrosEstudiantes = [...this.resumen.otrosEstudiantes];
    this.campus = this.resumen.campus;
    this.sede = this.resumen.sede;
    this.tipoAula = this.resumen.tipoAula;
    this.numeroaula = this.resumen.numeroaula;
    this.fecha = this.resumen.fecha;
    this.hora = this.resumen.hora;

    await this.cargarHorasOcupadas();

    this.resumen = null;
    alert('✅ Formulario listo para actualizar');
  }

  async cancelarReservacion() {
    if (this.docId) {
      try {
        const docRef = doc(this.firestore, 'reservas', this.docId);
        await deleteDoc(docRef);
        alert('❌ Reservación cancelada');
      } catch (error) {
        console.error('Error al eliminar la reservación', error);
        alert('⚠️ No se pudo eliminar la reservación de Firebase');
      }
      this.docId = null;
    }

    this.resumen = null;
    this.nombre = '';
    this.numeroCuenta = '';
    this.correo = '';
    this.otrosEstudiantes = [];
    this.campus = '';
    this.sede = '';
    this.tipoAula = '';
    this.numeroaula = '';
    this.fecha = '';
    this.hora = '';
    this.qrDataUrl = '';

    await this.cargarHorasOcupadas();
  }
}
