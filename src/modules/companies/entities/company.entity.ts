export interface Company {
  id?: string;
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  nit?: string;
  description?: string;
  isActive: boolean;
  creationDate: Date;
  endDate?: Date;
}
