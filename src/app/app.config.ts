import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAsQ0nZ8PyNgAS-5aLddzpeNWex-Optqyo",
  authDomain: "ceutecbooking-980dd.firebaseapp.com",
  projectId: "ceutecbooking-980dd",
  storageBucket: "ceutecbooking-980dd.firebasestorage.app",
  messagingSenderId: "41016987128",
  appId: "1:41016987128:web:336787fe74bd9f1a8e1a0d"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
