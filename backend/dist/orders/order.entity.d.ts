import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: number;
    userId: number;
    user: User;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}
