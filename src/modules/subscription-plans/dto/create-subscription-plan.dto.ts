export class CreateSubscriptionPlanDto {
  annualPrice: number;
  country: string;
  description: string;
  isActive?: boolean;
  licensePeriod: number;
  monthlyPrice: number;
  name: string;
  nonExpiringLicense: boolean;
}
