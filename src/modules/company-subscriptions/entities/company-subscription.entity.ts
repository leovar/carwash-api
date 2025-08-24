export interface CompanySubscription {
  id?: string;
  billingCycle: string;
  createdDate: Date;
  endDate: Date;
  idCompany: string;
  idSubscriptionPlan: string;
  isActive: boolean;
  licensePeriod: number;
  price: number;
  discount: number;
  vatPercentage: number;
  vatValue: number;
  finalPrice: number;
  startDate: Date;
}
