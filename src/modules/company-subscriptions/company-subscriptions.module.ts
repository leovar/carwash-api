import { Module } from '@nestjs/common';
import { CompanySubscriptionsService } from './company-subscriptions.service';
import { CompanySubscriptionsController } from './company-subscriptions.controller';
import { FirebaseService } from '../../database/firebase.service';

@Module({
  controllers: [CompanySubscriptionsController],
  providers: [CompanySubscriptionsService, FirebaseService],
  exports: [CompanySubscriptionsService],
})
export class CompanySubscriptionsModule {}
