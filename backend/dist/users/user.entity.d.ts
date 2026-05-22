import { Order } from '../orders/order.entity';
export declare class User {
    id: number;
    email: string;
    name: string;
    password: string;
    phone: string;
    role: string;
    orders: Order[];
}
