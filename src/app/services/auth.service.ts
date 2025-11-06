import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private db: Firestore;

  constructor() {
    const app = initializeApp(firebaseConfig); // Inicializa Firebase solo con Firestore
    this.db = getFirestore(app);
  }

  // LOGIN: busca un estudiante con correo y contraseña
  async loginEstudiante(correo: string, contrasena: string): Promise<boolean> {
    try {
      const estudiantesRef = collection(this.db, 'estudiantes');
      const q = query(
        estudiantesRef,
        where('correo', '==', correo),
        where('contrasena', '==', contrasena)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty; // true si existe coincidencia
    } catch (error) {
      console.error('Error login:', error);
      return false;
    }
   
  }
  // LOGIN: busca un docente con correo y contraseña
async logindocente(correo: string, contrasena: string): Promise<boolean> {
    try {
      const docentesRef = collection(this.db, 'docentes');
      const q = query(
        docentesRef,
        where('correo', '==', correo),
        where('contrasena', '==', contrasena)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty; // true si existe coincidencia
    } catch (error) {
      console.error('Error login:', error);
      return false;
    }
   
  }
  // REGISTRO: agrega un nuevo estudiante
  async registrarEstudiante(nombre: string, correo: string, contrasena: string): Promise<void> {
    try {
      const estudiantesRef = collection(this.db, 'estudiantes');
      const docRef = doc(estudiantesRef); // crea un id automático
      await setDoc(docRef, { nombre, correo, contrasena });
    } catch (error) {
      console.error('Error registro:', error);
      throw error;
    }
  }
  // REGISTRO: agrega un nuevo docente
  async registrarDocente(nombre: string, correo: string, contrasena: string): Promise<void> {
    try {
      const docentesRef = collection(this.db, 'docentes');
      const docRef = doc(docentesRef); // crea un id automático
      await setDoc(docRef, { nombre, correo, contrasena });
    } catch (error) {
      console.error('Error registro:', error);
      throw error;
    }
  }
}
