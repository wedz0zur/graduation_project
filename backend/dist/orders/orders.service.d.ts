import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { ProductsService } from '../products/products.service';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private productsService;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, productsService: ProductsService);
    findAll(userId?: number): Promise<Order[]>;
    create(data: {
        userId?: number;
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        items: {
            productId: number;
            quantity: number;
        }[];
    }): Promise<Order>;
}
