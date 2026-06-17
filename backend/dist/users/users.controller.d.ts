import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        name: string;
        phone: string;
        role: string;
        orders: import("../orders/order.entity").Order[];
    } | {
        error: string;
    }>;
    updateProfile(req: any, data: any): Promise<import("./user.entity").User>;
}
