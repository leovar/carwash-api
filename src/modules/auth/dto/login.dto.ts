// modules/auth/dto/login.dto.ts
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email!: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}
