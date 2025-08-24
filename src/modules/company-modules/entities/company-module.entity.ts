export interface CompanyModule {
  id?: string;
  additionalModulePrice: number;
  createdDate: Date;
  idAppModule: string;
  idCompany: string;
  isActive: boolean;
  isAdditionalModule: boolean;
  isUnlimitedRegisters: boolean;
  registersLimitCompany: number;
  registersLimitPlan: number;
}
