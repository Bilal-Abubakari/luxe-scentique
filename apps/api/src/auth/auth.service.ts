import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { IAuthUser, IUser, IJwtPayload, Role } from '@luxe-scentique/shared-types';

interface GoogleUserInput {
  email: string;
  name: string | undefined;
  avatar: string | undefined;
  googleId: string;
}

interface AuthTokens {
  accessToken: string;
  user: IAuthUser;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findOrCreateGoogleUser(input: GoogleUserInput): Promise<IUser> {
    const superAdminEmails = this.configService.get<string[]>('superAdmin.emails') ?? [];

    // Check if user exists by googleId or email
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: input.googleId }, { email: input.email }],
      },
    });

    if (user) {
      // Update Google ID if missing; also ensure super-admin role is applied if seeded
      const isSuperAdmin = superAdminEmails.includes(user.email);
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          ...(!user.googleId && { googleId: input.googleId }),
          ...(input.avatar && { avatar: input.avatar }),
          ...(isSuperAdmin && user.role !== Role.SUPER_ADMIN && { role: Role.SUPER_ADMIN }),
        },
      });
    } else {
      // Create new user; assign super-admin role for designated emails
      const role: Role = superAdminEmails.includes(input.email) ? Role.SUPER_ADMIN : Role.CUSTOMER;
      user = await this.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          avatar: input.avatar,
          googleId: input.googleId,
          role,
        },
      });
      this.logger.log(`New user registered: ${user.email} (${user.role})`);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role as Role,
      googleId: user.googleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  generateTokens(user: IUser): AuthTokens {
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
