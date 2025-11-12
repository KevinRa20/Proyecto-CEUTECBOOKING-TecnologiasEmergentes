import { Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-formulario-reservacion-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-reservacion-docente.html',
  styleUrl: './formulario-reservacion-docente.css',
})
export class FormularioReservacionDocente implements OnInit {

  nombre = '';
  nombredelacarrera = '';
  correo = '';
  nuevaClase: string[] = [];
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
    'Ceutec Tegucigalpa',
    'Ceutec La Ceiba',
    'Ceutec San Pedro Sula',
    'Ceutec Teledocencia'
  ];

  horasDisponibles = [
    '7:00 AM','8:30 AM','9:00 AM','10:00 AM','11:30 AM','12:30 PM','1:30 PM','2:00 PM','3:00 PM','4:30 PM','5:00 PM','6:00 PM','7:30 PM','8:00 PM','9:00 PM'
  ];
  

  horasOcupadas: string[] = [];

  ngOnInit() {}

  agregarClaseyseccion(clase: string):void {
    if (clase && !this.nuevaClase.includes(clase)) this.nuevaClase.push(clase);
  
  }
  
  async cargarHorasOcupadas() {
    if (!this.fecha || !this.campus || !this.tipoAula) return;

    const reservasRef = collection(this.firestore, 'reservas');
    const q = query(
      reservasRef,
      where('campus', '==', this.campus),
      where('tipoAula', '==', this.tipoAula),
      where('numeroaula', '==', this.numeroaula),
      where('fecha', '==', this.fecha)
    );

    const snapshot = await getDocs(q);

    // Corregido para que no haya error de tipo
    this.horasOcupadas = snapshot.docs.map(doc => {
      const data = doc.data() as { hora: string };
      return data.hora;
    });
  }

  aceptarReservacion() {
    if (!this.nombre || !this.nombredelacarrera || !this.correo) {
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
      nombredelacarrera: this.nombredelacarrera,
      correo: this.correo,
      nuevaClase: this.nuevaClase,
      campus: this.campus,
      sede: this.sede,
      tipoAula: this.tipoAula,
      numeroaula: this.numeroaula,
      fecha: this.fecha,
      hora: this.hora
    };
  }
//CREATE
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
Nombre de la carrera: ${this.resumen.nombredelacarrera}
Correo: ${this.resumen.correo}
Añadir clase y seccion: ${this.resumen.nuevaClase.join(', ')}
Campus: ${this.resumen.campus}
Sede: ${this.resumen.sede}
Tipo de aula: ${this.resumen.tipoAula}
Número de aula: ${this.resumen.numeroaula}
Fecha: ${this.resumen.fecha}
Hora: ${this.resumen.hora} (1.5 h)
      `;

      const QRCodeModule: any = await import('qrcode');
      this.qrDataUrl = await QRCodeModule.toDataURL(qrTexto);

      alert('✅ Reservación confirmada y QR generado.');
      this.cargarHorasOcupadas();
    } catch (error) {
      console.error(error);
      alert('❌ Error al confirmar la reservación.');
    }
  }
//UPDATE 
  actualizarReservacion() {
    if (!this.resumen) return;

    this.nombre = this.resumen.nombre;
    this.nombredelacarrera = this.resumen.nombredelacarrera;
    this.correo = this.resumen.correo;
    this.nuevaClase = [...this.resumen.nuevaClase];
    this.campus = this.resumen.campus;
    this.sede = this.resumen.sede;
    this.tipoAula = this.resumen.tipoAula;
    this.numeroaula = this.resumen.numeroaula;
    this.fecha = this.resumen.fecha;
    this.hora = this.resumen.hora;

    this.resumen = null;
  }
//DELETE
  async cancelarReservacion() {
    try {
      if (!this.docId) return;

      const reservasRef = doc(this.firestore, 'reservas', this.docId);
      await deleteDoc(reservasRef);

      this.resumen = null;
      this.qrDataUrl = '';
      this.docId = null;
      this.nombre = '';
      this.nombredelacarrera = '';
      this.correo = '';
      this.nuevaClase= [];
      this.campus = '';
      this.sede = '';
      this.tipoAula = '';
      this.numeroaula = '';
      this.fecha = '';
      this.hora = '';

      alert('🗑️ Reservación cancelada.');
      this.cargarHorasOcupadas();
    } catch (error) {
      console.error(error);
      alert('❌ Error al cancelar la reservación.');
    }
  }
}
