// modules/auth/dto/auth-response.dto.ts
export class AuthResponseDto {
  uid: string;
  email: string;
  accessToken: string;
  customToken?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}
