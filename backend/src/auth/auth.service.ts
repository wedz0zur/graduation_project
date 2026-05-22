import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      return { error: 'Email already registered' };
    }
    const user = await this.usersService.create(dto);
    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      return { error: 'Invalid credentials' };
    }
    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }
}
