import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { IAuthUser, IUser, Role } from '@luxe-scentique/shared-types';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @Throttle({ burst: { limit: 5, ttl: 1_000 }, sustained: { limit: 20, ttl: 60_000 } })
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth consent screen' })
  @ApiResponse({ status: 429, description: 'Too many requests — slow down and retry' })
  googleAuth(): void {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback handler' })
  @ApiResponse({ status: 200, description: 'Returns JWT access token' })
  googleCallback(
    @Req() req: Request & { user: IUser },
    @Res() res: Response,
  ): void {
    const { accessToken } = this.authService.generateTokens(req.user);

    const isAdmin = req.user.role === Role.ADMIN || req.user.role === Role.SUPER_ADMIN;
    const baseUrl = isAdmin
      ? (this.configService.get<string>('adminUrl') ?? 'http://localhost:4201')
      : (this.configService.get<string>('frontendUrl') ?? 'http://localhost:4200');

    res.redirect(`${baseUrl}/auth/callback?token=${accessToken}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Returns the authenticated user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  getMe(@CurrentUser() user: IAuthUser): IAuthUser {
    return user;
  }
}
