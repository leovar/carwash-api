export class CreateCompanySubscriptionDto {
  billingCycle: string;
  endDate: Date;
  idCompany: string;
  idSubscriptionPlan: string;
  isActive?: boolean;
  licensePeriod: number;
  price: number;
  discount: number;
  vatPercentage: number;
  vatValue: number;
  finalPrice: number;
  startDate: Date;
}
