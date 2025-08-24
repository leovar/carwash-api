import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanySubscriptionDto } from './create-company-subscription.dto';

export class UpdateCompanySubscriptionDto extends PartialType(
  CreateCompanySubscriptionDto,
) {}
