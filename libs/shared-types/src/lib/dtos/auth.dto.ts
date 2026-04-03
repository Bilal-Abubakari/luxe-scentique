import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty()
  credential!: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export interface AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    role: string;
  };
}
