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

      if (error?.code === 'auth/id-token-expired') {
        throw new UnauthorizedException('Token has expired');
      } else if (error?.code === 'auth/id-token-revoked') {
        throw new UnauthorizedException('Token has been revoked');
      } else if (error?.code === 'auth/invalid-id-token') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Authentication failed');
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
