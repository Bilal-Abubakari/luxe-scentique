import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { IUser, Role } from '@luxe-scentique/shared-types';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  findAll(): Promise<IUser[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  findOne(@Param('id') id: string): Promise<IUser> {
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user role (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  updateRole(@Param('id') id: string, @Body('role') role: Role): Promise<IUser> {
    return this.usersService.updateRole(id, role);
  }
}
