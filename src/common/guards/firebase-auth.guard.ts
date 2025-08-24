import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('No authorization header provided');
      throw new UnauthorizedException('Authorization header is required');
    }

    const [bearer, token]: string[] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      this.logger.warn('Invalid authorization header format');
      throw new UnauthorizedException(
        'Invalid authorization header format. Expected: Bearer <token>',
      );
    }

    try {
      const decodedToken: admin.auth.DecodedIdToken =
        await this.firebaseService.verifyIdToken(token);

      // Attach the decoded token to the request object for use in controllers
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified,
        name: decodedToken.name,
        picture: decodedToken.picture,
        firebase: decodedToken,
      };

      this.logger.log(`User authenticated: ${decodedToken.uid}`);
      return true;
    } catch (error: any) {
      this.logger.error('Token verification failed', error);

      // Handle specific Firebase auth errors
      const errorCode = error?.code || error?.errorInfo?.code;
      const errorMessage =
        error?.message || error?.errorInfo?.message || 'Authentication failed';

      if (
        errorCode === 'auth/id-token-expired' ||
        errorCode === 'auth/td-token-expired'
      ) {
        throw new UnauthorizedException({
          message:
            'Firebase ID token has expired. Get a fresh ID token from your client app and try again',
          code: 'auth/id-token-expired',
          codePrefix: 'auth',
        });
      } else if (errorCode === 'auth/id-token-revoked') {
        throw new UnauthorizedException({
          message: 'Token has been revoked',
          code: 'auth/id-token-revoked',
          codePrefix: 'auth',
        });
      } else if (errorCode === 'auth/invalid-id-token') {
        throw new UnauthorizedException({
          message: 'Invalid token format or signature',
          code: 'auth/invalid-id-token',
          codePrefix: 'auth',
        });
      } else if (errorCode === 'auth/project-not-found') {
        throw new UnauthorizedException({
          message: 'Firebase project not found',
          code: 'auth/project-not-found',
          codePrefix: 'auth',
        });
      } else if (errorCode === 'auth/user-not-found') {
        throw new UnauthorizedException({
          message: 'User not found',
          code: 'auth/user-not-found',
          codePrefix: 'auth',
        });
      } else {
        // Log the full error for debugging
        this.logger.error('Unhandled authentication error:', {
          code: errorCode,
          message: errorMessage,
          fullError: error,
        });

        throw new UnauthorizedException({
          message: 'Authentication failed',
          code: errorCode || 'auth/unknown-error',
          codePrefix: 'auth',
        });
      }
    }
  }
}

// Interface for the user object attached to requests
export interface AuthenticatedUser {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  firebase: admin.auth.DecodedIdToken;
}
