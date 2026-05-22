import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: CreateUserDto): Promise<{
        error: string;
        token?: undefined;
        user?: undefined;
    } | {
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
        error?: undefined;
    }>;
    login(dto: LoginUserDto): Promise<{
        error: string;
        token?: undefined;
        user?: undefined;
    } | {
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
        error?: undefined;
    }>;
}
