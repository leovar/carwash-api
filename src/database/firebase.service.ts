// database/firebase.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import {
  FirebaseAdminConfig,
  initializeFirebaseAdmin,
  validateFirebaseConfig,
  getFirebaseConfig,
  getEnvironmentConfig,
  initializeFirebaseFromEnv,
} from '../config/firebase.config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;
  private firestore: admin.firestore.Firestore;
  private auth: admin.auth.Auth;
  private storage: admin.storage.Storage;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const configType = getEnvironmentConfig();

      if (configType === 'env') {
        this.logger.log(
          'Initializing Firebase Admin SDK from environment variables',
        );
        this.firebaseApp = initializeFirebaseFromEnv();
      } else {
        this.logger.log(
          'Initializing Firebase Admin SDK from service account file',
        );
        const firebaseConfig = getFirebaseConfig();
        validateFirebaseConfig(firebaseConfig);
        this.firebaseApp = initializeFirebaseAdmin(firebaseConfig);
      }

      // Inicializar servicios
      this.firestore = this.firebaseApp.firestore();
      this.auth = this.firebaseApp.auth();
      this.storage = this.firebaseApp.storage();

      // Configuración adicional de Firestore
      if (!admin.apps.length) {
        // Solo inicializa si no hay apps
        this.firestore.settings({ ignoreUndefinedProperties: true });
      } else {
        // No vuelvas a llamar a settings()
      }

      this.logger.log(`Firebase Admin SDK initialized successfully`);
      this.logger.log(`Project ID: ${this.firebaseApp.options.projectId}`);
      this.logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
      throw error;
    }
  }

  getFirestore(): admin.firestore.Firestore {
    if (!this.firestore) {
      throw new Error('Firestore not initialized');
    }
    return this.firestore;
  }

  getAuth(): admin.auth.Auth {
    if (!this.auth) {
      throw new Error('Firebase Auth not initialized');
    }
    return this.auth;
  }

  getStorage(): admin.storage.Storage {
    if (!this.storage) {
      throw new Error('Firebase Storage not initialized');
    }
    return this.storage;
  }

  getApp(): admin.app.App {
    if (!this.firebaseApp) {
      throw new Error('Firebase App not initialized');
    }
    return this.firebaseApp;
  }

  // Método para verificar la conexión
  async healthCheck(): Promise<boolean> {
    try {
      // Verificar conexión con Firestore
      await this.firestore.collection('health').limit(1).get();

      // Verificar conexión con Auth
      await this.auth.listUsers(1);

      return true;
    } catch (error) {
      this.logger.error('Firebase health check failed', error);
      return false;
    }
  }

  // Método para obtener información del proyecto
  getProjectInfo() {
    return {
      projectId: this.firebaseApp.options.projectId,
      environment: process.env.NODE_ENV || 'development',
      storageBucket: this.firebaseApp.options.storageBucket,
      databaseURL: this.firebaseApp.options.databaseURL,
    };
  }

  // Métodos utilitarios para operaciones comunes

  // Crear un token personalizado para un usuario
  async createCustomToken(
    uid: string,
    additionalClaims?: object,
  ): Promise<string> {
    try {
      return await this.auth.createCustomToken(uid, additionalClaims);
    } catch (error) {
      this.logger.error(`Failed to create custom token for user ${uid}`, error);
      throw error;
    }
  }

  // Verificar un token de ID
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.auth.verifyIdToken(idToken);
    } catch (error) {
      this.logger.error('Failed to verify ID token', error);
      throw error;
    }
  }

  // Crear un usuario
  async createUser(
    userData: admin.auth.CreateRequest,
  ): Promise<admin.auth.UserRecord> {
    try {
      return await this.auth.createUser(userData);
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw error;
    }
  }

  // Obtener un usuario por UID
  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await this.auth.getUser(uid);
    } catch (error) {
      this.logger.error(`Failed to get user ${uid}`, error);
      throw error;
    }
  }

  // Obtener un usuario por email
  async getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
    try {
      return await this.auth.getUserByEmail(email);
    } catch (error) {
      this.logger.error(`Failed to get user with email ${email}`, error);
      throw error;
    }
  }

  // Actualizar un usuario
  async updateUser(
    uid: string,
    userData: admin.auth.UpdateRequest,
  ): Promise<admin.auth.UserRecord> {
    try {
      return await this.auth.updateUser(uid, userData);
    } catch (error) {
      this.logger.error(`Failed to update user ${uid}`, error);
      throw error;
    }
  }

  // Eliminar un usuario
  async deleteUser(uid: string): Promise<void> {
    try {
      await this.auth.deleteUser(uid);
      this.logger.log(`User ${uid} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete user ${uid}`, error);
      throw error;
    }
  }

  // Establecer claims personalizados para un usuario
  async setCustomUserClaims(uid: string, customClaims: object): Promise<void> {
    try {
      await this.auth.setCustomUserClaims(uid, customClaims);
      this.logger.log(`Custom claims set for user ${uid}`);
    } catch (error) {
      this.logger.error(`Failed to set custom claims for user ${uid}`, error);
      throw error;
    }
  }

  // Método para ejecutar transacciones en Firestore
  async runTransaction<T>(
    updateFunction: (transaction: admin.firestore.Transaction) => Promise<T>,
  ): Promise<T> {
    try {
      return await this.firestore.runTransaction(updateFunction);
    } catch (error) {
      this.logger.error('Transaction failed', error);
      throw error;
    }
  }

  // Método para crear un batch de escrituras
  createBatch(): admin.firestore.WriteBatch {
    return this.firestore.batch();
  }
}

// Esta es otra forma de hacer esta clase
/*
import { Injectable } from '@nestjs/common';
import { FirebaseAdmin } from '../../config/firebase.config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseAdmin: FirebaseAdmin) {}

  async create(createUserDto: CreateUserDto) {
    const userRef = this.firebaseAdmin.firestore.collection('users').doc();
    await userRef.set(createUserDto);
    return { id: userRef.id, ...createUserDto };
  }

  // ...otros métodos...
}
*/
