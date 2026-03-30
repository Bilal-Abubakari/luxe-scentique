import { Role } from '../enums';

export interface IUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: Role;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export interface IGoogleProfile {
  id: string;
  emails: Array<{ value: string; verified: boolean }>;
  displayName: string;
  photos: Array<{ value: string }>;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface IUserPreferences {
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}
