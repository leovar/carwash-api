import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionPlanModuleDto } from './create-subscription-plan-module.dto';

export class UpdateSubscriptionPlanModuleDto extends PartialType(
  CreateSubscriptionPlanModuleDto,
) {}
