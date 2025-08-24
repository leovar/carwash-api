import { Module } from '@nestjs/common';
import { SubscriptionPlanModulesService } from './subscription-plan-modules.service';
import { SubscriptionPlanModulesController } from './subscription-plan-modules.controller';
import { FirebaseService } from '../../database/firebase.service';

@Module({
  controllers: [SubscriptionPlanModulesController],
  providers: [SubscriptionPlanModulesService, FirebaseService],
  exports: [SubscriptionPlanModulesService],
})
export class SubscriptionPlanModulesModule {}
