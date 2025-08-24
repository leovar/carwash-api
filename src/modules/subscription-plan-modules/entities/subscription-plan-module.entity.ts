export interface SubscriptionPlanModule {
  id?: string;
  createdDate: Date;
  idAppModule: string;
  idSubscriptionPlan: string;
  isUnlimited: boolean;
  registersLimit: number;
}
