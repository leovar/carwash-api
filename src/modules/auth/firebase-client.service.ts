// modules/auth/firebase-client.service.ts
import { Injectable } from '@nestjs/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, Auth } from 'firebase/auth';

@Injectable()
export class FirebaseClientService {
  private app: FirebaseApp;
  private auth: Auth;

  constructor() {
    // Configuración del cliente (obtener de Firebase Console)
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_CLIENT_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };

    this.app = initializeApp(firebaseConfig, 'client');
    this.auth = getAuth(this.app);
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<string> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      return idToken;
    } catch (error) {
      throw new Error('Credenciales inválidas');
    }
  }
}
