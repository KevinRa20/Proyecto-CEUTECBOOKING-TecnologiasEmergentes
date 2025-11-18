import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';

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
  selector: 'app-formulario-reservacion-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-reservacion-estudiante.html',
  styleUrls: ['./formulario-reservacion-estudiante.css']
})
export class FormularioReservacionEstudianteComponent implements OnInit {
  // Variables del formulario
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
  
  // Variables de estado
  resumen: Reservacion | null = null;
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
    'Unitec Tegucigalpa','Unitec San Pedro Sula','Ceutec Tegucigalpa','Ceutec La Ceiba',
    'Ceutec San Pedro Sula','Universidad Virtual','Unitec Teledocencia','Ceutec Teledocencia'
    'Ceutec Tegucigalpa',
    'Ceutec La Ceiba',
    'Ceutec San Pedro Sula',
    'Ceutec Teledocencia'
  ];

  horasDisponibles = [
   '7:00 AM','8:30 AM','9:00 AM','10:00 AM','11:30 AM','12:30 PM','1:30 PM','2:00 PM','3:00 PM','4:30 PM','5:00 PM','6:00 PM','7:30 PM','8:00 PM','9:00 PM'
  ];

  horasDisponibles = ['8:00 AM','9:30 AM','11:00 AM','12:30 PM','2:00 PM','3:30 PM','5:00 PM','6:30 PM','8:00 PM','9:30 PM'];
  horasOcupadas: string[] = [];

  ngOnInit() {}

  agregarEstudiante(nombre: string) { 
    const nombreLimpio = nombre.trim();
    if(nombreLimpio && !this.otrosEstudiantes.includes(nombreLimpio)) {
      this.otrosEstudiantes.push(nombreLimpio);
    }
  }

  eliminarEstudiante(index: number) {
    this.otrosEstudiantes.splice(index, 1);
  }

  async cargarHorasOcupadas() {
    if(!this.fecha || !this.campus || !this.tipoAula || !this.numeroaula) {
      this.horasOcupadas = [];
      return;
    }
    
    this.cargando = true;
    try {
      const reservasRef = collection(this.firestore, 'reservas');
      const q = query(
        reservasRef, 
        where('campus','==',this.campus), 
        where('tipoAula','==',this.tipoAula), 
        where('numeroaula','==',this.numeroaula), 
        where('fecha','==',this.fecha)
      );
      const snapshot = await getDocs(q);
      this.horasOcupadas = snapshot.docs.map(doc => (doc.data() as { hora:string }).hora);
    } catch (error) {
      console.error('Error cargando horas ocupadas:', error);
      this.horasOcupadas = [];
    } finally {
      this.cargando = false;
    }
  }

  aceptarReservacion() {
    if(!this.nombre || !this.numeroCuenta || !this.correo){ 
      alert('Complete campos obligatorios'); 
      return; 
    }
    
    const correoRegex = /^[^\s@]+@[^\s@]+\.edu(\.[a-z]{2,})?$/i;
    if(!correoRegex.test(this.correo)){ 
      alert('Correo debe ser educativo'); 
      return; 
    }
    
    if(!this.hora) {
      alert('Seleccione una hora');
      return;
    }

    if(this.horasOcupadas.includes(this.hora)) {
      alert('La hora seleccionada no está disponible. Por favor seleccione otra hora.');
      return;
    }

    this.resumen = { 
      nombre: this.nombre, 
      numeroCuenta: this.numeroCuenta, 
      correo: this.correo, 
      otrosEstudiantes: [...this.otrosEstudiantes], 
      campus: this.campus, 
      sede: this.sede, 
      tipoAula: this.tipoAula, 
      numeroaula: this.numeroaula, 
      fecha: this.fecha, 
      hora: this.hora 
    };
  }

  async confirmarReservacion() {
    if(!this.resumen) return;
    
    this.confirmando = true;
    this.errorQR = false;
    
    try {
      // Verificar disponibilidad
      await this.cargarHorasOcupadas();
      
      if(this.horasOcupadas.includes(this.resumen.hora)) {
        alert('La hora seleccionada ya no está disponible. Por favor seleccione otra hora.');
        this.actualizarReservacion();
        return;
      }

      // Guardar en Firestore
      const reservasRef = collection(this.firestore,'reservas');
      if(this.docId){ 
        await setDoc(doc(this.firestore,'reservas',this.docId), this.resumen); 
      } else { 
        const docRef = await addDoc(reservasRef, this.resumen); 
        this.docId = docRef.id; 
      }

      // GENERAR QR CON URL CON HASH
      await this.generarQRConURL();
      
      this.reservacionConfirmada = true;
      this.qrGenerado = true;
      
    } catch(e){ 
      console.error('Error al confirmar:', e); 
      alert('Error al confirmar la reservación'); 
      this.errorQR = true;
    } finally {
      this.confirmando = false;
    }
  }

  // MÉTODO CORREGIDO: GENERAR QR CON URL CON HASH
  private async generarQRConURL(): Promise<void> {
    if (!this.resumen || !this.docId) return;

    this.generandoQR = true;
    this.qrCargado = false;
    this.errorQR = false;

    try {
      console.log('Iniciando generación de QR con URL con hash...');
      
      // URL CON HASH - CORREGIDO
      const qrURL = `https://ceutecbooking-980dd.web.app/#/qrreserva?id=${this.docId}`;
      console.log('URL con hash para QR:', qrURL);

      // Intentar cargar QRCode
      let QRCode: any;
      
      try {
        const QRCodeModule = await import('qrcode');
        QRCode = QRCodeModule.default || QRCodeModule;
        console.log('QRCode cargado via import dinámico');
      } catch (importError) {
        console.warn('Error en import dinámico, intentando método alternativo...', importError);
        throw new Error('No se pudo cargar la librería QRCode');
      }

      // Generar QR con la URL CON HASH
      this.qrDataUrl = await QRCode.toDataURL(qrURL, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      console.log('QR con URL hash generado exitosamente');
      
    } catch (error) {
      console.error('Error crítico generando QR:', error);
      this.errorQR = true;
      this.generarQRRespaldoSimple();
    } finally {
      this.generandoQR = false;
    }
  }

  // GENERAR QR DE RESpaldo SIMPLE
  private generarQRRespaldoSimple(): void {
    console.log('Generando QR de respaldo simple...');
    
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
      console.log('QR de respaldo simple generado');
    
    } catch (error) {
      console.error('Error generando QR de respaldo:', error);
      this.qrDataUrl = '';
      this.errorQR = true;
    }
  }

  // MANEJADORES DE EVENTOS MEJORADOS
  onQRLoaded() {
    console.log('✅ QR cargado y listo para escanear');
    this.qrCargado = true;
    this.errorQR = false;
  }

  onQRError() {
    console.error('❌ Error cargando imagen QR');
    this.qrCargado = false;
    this.errorQR = true;
  }

  async regenerarQR() {
    console.log('🔄 Regenerando QR...');
    this.qrDataUrl = '';
    this.qrCargado = false;
    this.errorQR = false;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.generarQRConURL();
  }

  actualizarReservacion() {
    if(!this.resumen) return;
    Object.assign(this, {...this.resumen}); 
    this.resumen = null;
    this.reservacionConfirmada = false;
    this.qrGenerado = false;
    this.qrDataUrl = '';
    this.qrCargado = false;
    this.errorQR = false;
  }

  async cancelarReservacion() {
    if(confirm('¿Está seguro de que desea cancelar esta reservación?')) {
      try {
        if(this.docId) {
          await deleteDoc(doc(this.firestore,'reservas',this.docId));
        }
        
        this.limpiarFormulario();
        alert('Reservación cancelada exitosamente');
        
      } catch(e){ 
        console.error(e); 
        alert('Error al cancelar la reservación'); 
      }
    }
  }

  // Método para probar la ruta (URL con hash)
  probarRutaQR() {
    if (this.docId) {
      const urlQR = `/#/qrreserva?id=${this.docId}`; // ← CON HASH
      console.log('🔗 Navegando a ruta con hash:', urlQR);
      window.location.href = urlQR;
    } else {
      alert('Primero confirma una reservación');
    }
  }

  // Método para verificar URL del QR
  verificarURLQR() {
    if (this.docId) {
      const urlCompleta = `https://ceutecbooking-980dd.web.app/#/qrreserva?id=${this.docId}`;
      console.log('🔗 URL COMPLETA con hash:', urlCompleta);
      
      // Abrir en nueva pestaña para probar
      window.open(urlCompleta, '_blank');
      
      alert(`URL del QR generada:\n${urlCompleta}\n\nSe ha abierto en nueva pestaña.`);
    } else {
      alert('No hay ID de reservación generado');
    }
  }

  // Método para probar ambas URLs (normal y con hash)
  probarAmbasURLs() {
    if (!this.docId) {
      alert('No hay ID de reservación');
      return;
    }

    const urlNormal = `https://ceutecbooking-980dd.web.app/qrreserva?id=${this.docId}`;
    const urlConHash = `https://ceutecbooking-980dd.web.app/#/qrreserva?id=${this.docId}`;
    
    console.log('🔗 URL Normal:', urlNormal);
    console.log('🔗 URL con Hash:', urlConHash);
    
    // Abrir ambas para probar
    window.open(urlNormal, 'url_normal');
    setTimeout(() => {
      window.open(urlConHash, 'url_hash');
    }, 500);
    
    alert(`Probando ambas URLs:\n\n• Normal: ${urlNormal}\n• Con Hash: ${urlConHash}\n\nSe abrirán en pestañas separadas.`);
  }

  private limpiarFormulario() {
    this.resumen = null; 
    this.qrDataUrl = ''; 
    this.docId = null; 
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

  // Propiedad computada para los items del resumen
  get resumenItems() {
    if (!this.resumen) return [];
    
    return [
      {label:'Nombre', value: this.resumen.nombre, icon:'fas fa-user azul'},
      {label:'Número de cuenta', value: this.resumen.numeroCuenta, icon:'fas fa-id-card rojo'},
      {label:'Correo', value: this.resumen.correo, icon:'fas fa-envelope azul'},
      {label:'Otros estudiantes', value: this.resumen.otrosEstudiantes.join(', ') || 'Ninguno', icon:'fas fa-users beige'},
      {label:'Campus', value: this.resumen.campus, icon:'fas fa-university azul'},
      {label:'Sede', value: this.resumen.sede || 'No especificada', icon:'fas fa-map-marker-alt rojo'},
      {label:'Tipo de aula', value: this.resumen.tipoAula, icon:'fas fa-chalkboard beige'},
      {label:'Número de aula', value: this.resumen.numeroaula, icon:'fas fa-door-open beige'},
      {label:'Fecha reservación', value: this.resumen.fecha, icon:'fas fa-calendar-alt azul'},
      {label:'Hora reservación', value: this.resumen.hora + ' (1.5 h)', icon:'fas fa-clock rojo'}
    ];
  }
}