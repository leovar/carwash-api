export class CreateCompanyModuleDto {
  additionalModulePrice: number;
  idAppModule: string;
  idCompany: string;
  isActive?: boolean;
  isAdditionalModule: boolean;
  isUnlimitedRegisters: boolean;
  registersLimitCompany: number;
  registersLimitPlan: number;
}
