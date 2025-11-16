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
    const app = initializeApp(firebaseConfig);
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
      return !snapshot.empty;
    } catch (error) {
      console.error('Error login estudiante:', error);
      return false;
    }
  }

  // ✅ CORRECCIÓN: Nombre del método corregido (loginDocente en lugar de logindocente)
  async loginDocente(correo: string, contrasena: string): Promise<boolean> {
    try {
      const docentesRef = collection(this.db, 'docentes');
      const q = query(
        docentesRef,
        where('correo', '==', correo),
        where('contrasena', '==', contrasena)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error login docente:', error);
      return false;
    }
  }

  // REGISTRO: agrega un nuevo estudiante
  async registrarEstudiante(nombre: string, correo: string, contrasena: string): Promise<void> {
    try {
      const estudiantesRef = collection(this.db, 'estudiantes');
      const docRef = doc(estudiantesRef);
      await setDoc(docRef, { 
        nombre, 
        correo, 
        contrasena,
        fechaRegistro: new Date() 
      });
    } catch (error) {
      console.error('Error registro estudiante:', error);
      throw new Error('No se pudo registrar el estudiante');
    }
  }

  // REGISTRO: agrega un nuevo docente
  async registrarDocente(nombre: string, correo: string, contrasena: string): Promise<void> {
    try {
      const docentesRef = collection(this.db, 'docentes');
      const docRef = doc(docentesRef);
      await setDoc(docRef, { 
        nombre, 
        correo, 
        contrasena,
        fechaRegistro: new Date() 
      });
    } catch (error) {
      console.error('Error registro docente:', error);
      throw new Error('No se pudo registrar el docente');
    }
  }
}