import { Module } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';
import { SubscriptionPlansController } from './subscription-plans.controller';
import { FirebaseService } from '../../database/firebase.service';

@Module({
  controllers: [SubscriptionPlansController],
  providers: [SubscriptionPlansService, FirebaseService],
  exports: [SubscriptionPlansService],
})
export class SubscriptionPlansModule {}
