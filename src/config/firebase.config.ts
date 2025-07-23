// config/firebase.config.ts
import { registerAs } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// Interfaz para la configuración de Firebase Admin
export interface FirebaseAdminConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
  databaseURL?: string;
  storageBucket?: string;
}

// Función para cargar las credenciales del service account
const loadServiceAccount = (): ServiceAccount => {
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
      path.join(process.cwd(), 'carwashServiceAccountKey.json');

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account file not found at: ${serviceAccountPath}`);
    }

    const serviceAccountRaw = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8')) as {
      project_id: string;
      private_key: string;
      client_email: string;
    };

    return {
      projectId: serviceAccountRaw.project_id,
      privateKey: serviceAccountRaw.private_key,
      clientEmail: serviceAccountRaw.client_email,
    } as ServiceAccount;
  } catch (error) {
    throw new Error(`Failed to load Firebase service account: ${error.message}`);
  }
};

// Configuración de Firebase Admin usando variables de entorno y service account
export const firebaseConfig = registerAs(
  'firebase',
  (): FirebaseAdminConfig => {
    const serviceAccount = loadServiceAccount();

    return {
      projectId: serviceAccount.projectId ?? (() => { throw new Error('projectId is undefined'); })(),
      privateKey: serviceAccount.privateKey ?? (() => { throw new Error('privateKey is undefined'); })(),
      clientEmail: serviceAccount.clientEmail ?? (() => { throw new Error('clientEmail is undefined'); })(),
      databaseURL:
        process.env.FIREBASE_DATABASE_URL ||
        `https://${serviceAccount.projectId}-default-rtdb.firebaseio.com/`,
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET ||
        `${serviceAccount.projectId}.appspot.com`,
    };
  },
);

// Factory para inicializar Firebase Admin
export const initializeFirebaseAdmin = (
  config: FirebaseAdminConfig,
): admin.app.App => {
  // Verificar si ya está inicializado
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const adminConfig: admin.AppOptions = {
    credential: admin.credential.cert({
      projectId: config.projectId,
      privateKey: config.privateKey.replace(/\\n/g, '\n'),
      clientEmail: config.clientEmail,
    }),
    databaseURL: config.databaseURL,
    storageBucket: config.storageBucket,
  };

  return admin.initializeApp(adminConfig);
};

// Configuración alternativa usando variables de entorno (más segura para producción)
export const firebaseConfigFromEnv = registerAs(
  'firebase-env',
  (): FirebaseAdminConfig => ({
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  }),
);

// Factory para inicializar desde variables de entorno
export const initializeFirebaseFromEnv = (): admin.app.App => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const adminConfig: admin.AppOptions = {
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  };

  return admin.initializeApp(adminConfig);
};

// Validación de configuración
export const validateFirebaseConfig = (config: FirebaseAdminConfig): void => {
  const requiredFields = ['projectId', 'privateKey', 'clientEmail'];

  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Firebase Admin configuration missing required field: ${field}`);
    }
  }

  // Validaciones adicionales
  if (!config.privateKey.includes('BEGIN PRIVATE KEY')) {
    throw new Error('Invalid private key format');
  }

  if (!config.clientEmail.includes('@') || !config.clientEmail.includes('.iam.gserviceaccount.com')) {
    throw new Error('Invalid client email format');
  }
};

// Configuración para diferentes entornos
export const getEnvironmentConfig = (): 'file' | 'env' => {
  const env = process.env.NODE_ENV || 'development';
  const useFileCredentials = process.env.FIREBASE_USE_FILE_CREDENTIALS === 'true';

  // En desarrollo, usar archivo; en producción, usar variables de entorno
  if (env === 'production' || process.env.FIREBASE_PRIVATE_KEY) {
    return 'env';
  }

  return 'file';
};

// Helper para obtener la configuración correcta según el entorno
export const getFirebaseConfig = (): FirebaseAdminConfig => {
  const configType = getEnvironmentConfig();

  if (configType === 'env') {
    return firebaseConfigFromEnv();
  } else {
    return firebaseConfig();
  }
};
/*  //Este es otra manera de crear este archivo por si el actual no funciona bien
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../carwashServiceAccountKey.json'; // Ajusta la ruta si es necesario

@Injectable()
export class FirebaseAdmin {
  private static instance: admin.app.App;

  constructor() {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL, // Usa variable de entorno
      });
    }
  }

  get firestore(): admin.firestore.Firestore {
    return FirebaseAdmin.instance.firestore();
  }

  get auth(): admin.auth.Auth {
    return FirebaseAdmin.instance.auth();
  }
}
*/
