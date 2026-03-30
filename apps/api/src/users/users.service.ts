import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUser, Role } from '@luxe-scentique/shared-types';

type PrismaUserRow = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<IUser[]> {
    const users = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return users.map((u: PrismaUserRow) => this.mapUser(u));
  }

  async findOne(id: string): Promise<IUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return this.mapUser(user);
  }

  async updateRole(id: string, role: Role): Promise<IUser> {
    await this.findOne(id);
    const user = await this.prisma.user.update({ where: { id }, data: { role } });
    return this.mapUser(user);
  }

  private mapUser(user: PrismaUserRow): IUser {
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
}
