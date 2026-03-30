import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { IUser } from '@luxe-scentique/shared-types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('google.clientId') || 'CONFIGURE_GOOGLE_CLIENT_ID',
      clientSecret: configService.get<string>('google.clientSecret') || 'CONFIGURE_GOOGLE_CLIENT_SECRET',
      callbackURL: configService.get<string>('google.callbackUrl') ?? 'http://localhost:3003/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;
    const avatar = profile.photos?.[0]?.value;
    const googleId = profile.id;

    if (!email) {
      done(new Error('No email returned from Google'), undefined);
      return;
    }

    const user: IUser = await this.authService.findOrCreateGoogleUser({
      email,
      name,
      avatar,
      googleId,
    });

    done(null, user);
  }
}
