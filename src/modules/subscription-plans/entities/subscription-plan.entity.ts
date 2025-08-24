export interface SubscriptionPlan {
  id?: string;
  annualPrice: number;
  country: string;
  createdDate: Date;
  description: string;
  isActive: boolean;
  licensePeriod: number;
  monthlyPrice: number;
  name: string;
  nonExpiringLicense: boolean;
}
