import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { FirebaseService } from '../../database/firebase.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, FirebaseService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
