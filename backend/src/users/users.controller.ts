import { Controller, Get, Put, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) return { error: 'User not found' };
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: any, @Body() data: any) {
    if (data.currentPassword || data.password) {
      const user = await this.usersService.findById(req.user.id);
      if (!user) throw new UnauthorizedException('User not found');

      if (!data.currentPassword || !(await bcrypt.compare(data.currentPassword, user.password))) {
        throw new UnauthorizedException('Неверный текущий пароль');
      }
    }

    const { currentPassword, ...updateData } = data;
    return this.usersService.update(req.user.id, updateData);
  }
}
