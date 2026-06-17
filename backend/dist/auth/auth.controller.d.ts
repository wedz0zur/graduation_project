import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
