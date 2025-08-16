import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  city: string;

  @IsNumber()
  @IsOptional()
  companyCode?: number;

  @IsString()
  companyName: string;

  @IsString()
  @IsOptional()
  contactName?: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsString()
  @IsOptional()
  mainCompany?: string;

  @IsString()
  nit: string;

  @IsString()
  phone: string;

  @IsString()
  region: string;
}
