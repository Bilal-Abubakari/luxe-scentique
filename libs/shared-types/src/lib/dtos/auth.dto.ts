export interface GoogleAuthDto {
  credential: string;
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

export interface RefreshTokenDto {
  refreshToken: string;
}
