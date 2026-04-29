import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/user.decorator'; 
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) 
@Roles(Role.ADMIN)                   
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @HttpCode(200)
  async getStats() {
    return this.adminService.getPlatformStats();
  }

  @Get('users')
  @HttpCode(200)
  async getUsers(@Query() query: GetUsersQueryDto) {
    return this.adminService.getUsers(query.page, query.limit, query.search);
  }

  @Get('users/:id')
  @HttpCode(200)
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/role')
  @HttpCode(200)
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser('id') adminId: string, 
  ) {
    return this.adminService.updateUserRole(id, dto.role, adminId);
  }

  @Delete('users/:id')
  @HttpCode(200)
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}