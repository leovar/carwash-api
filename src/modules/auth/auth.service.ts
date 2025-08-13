// modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';
import { FirebaseClientService } from './firebase-client.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private firebaseService: FirebaseService,
    private firebaseClientService: FirebaseClientService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    try {
      // Paso 1: Autenticar con Firebase Client SDK
      const idToken =
        await this.firebaseClientService.signInWithEmailAndPassword(
          email,
          password,
        );

      // Paso 2: Verificar el token con Admin SDK
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);

      // Paso 3: Obtener información del usuario
      const userRecord = await this.firebaseService.getUserByUid(
        decodedToken.uid,
      );

      // Paso 4: Crear token personalizado (opcional)
      const customToken = await this.firebaseService.createCustomToken(
        decodedToken.uid,
      );

      // Paso 5: Obtener datos adicionales
      const additionalUserData = await this.getUserAdditionalData(
        decodedToken.uid,
      );

      const authResponse: AuthResponseDto = {
        uid: userRecord.uid,
        email: userRecord.email,
        accessToken: idToken,
        customToken: customToken,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
        role: ['admin'],
        ...additionalUserData,
      };

      return authResponse;
    } catch (error) {
      this.logger.error(`Login failed for ${email}:`, error);
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  // Método alternativo: Login con verificación de token
  async loginWithIdToken(idToken: string): Promise<AuthResponseDto> {
    try {
      // Verificar el token de ID
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);

      // Obtener información del usuario
      const userRecord = await this.firebaseService.getUserByUid(
        decodedToken.uid,
      );

      // Obtener datos adicionales
      const additionalUserData = await this.getUserAdditionalData(
        decodedToken.uid,
      );

      const authResponse: AuthResponseDto = {
        uid: userRecord.uid,
        email: userRecord.email,
        accessToken: idToken,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
        role: ['admin'],
        ...additionalUserData,
      };

      this.logger.log(`User ${userRecord.email} authenticated with ID token`);
      return authResponse;
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }

  private async getUserAdditionalData(uid: string): Promise<any> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const userDoc = await firestore.collection('users').doc(uid).get();

      if (userDoc.exists) {
        return userDoc.data();
      }

      return {};
    } catch (error) {
      this.logger.warn(
        `Could not fetch additional data for user ${uid}:`,
        error,
      );
      return {};
    }
  }

  async logout(uid: string): Promise<{ message: string }> {
    try {
      // Revocar tokens del usuario (opcional)
      await this.firebaseService.getAuth().revokeRefreshTokens(uid);

      this.logger.log(`User ${uid} logged out successfully`);
      return { message: 'Logout exitoso' };
    } catch (error) {
      this.logger.error(`Logout failed for user ${uid}:`, error);
      throw new Error('Error durante el logout');
    }
  }

  async validateUser(idToken: string): Promise<any> {
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      return null;
    }
  }
}
