import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseClientService } from './firebase-client.service';
import { FirebaseService } from '../../database/firebase.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    FirebaseClientService,
    FirebaseService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
