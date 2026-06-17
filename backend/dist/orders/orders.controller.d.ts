import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    findAll(req: any): Promise<import("./order.entity").Order[]>;
    create(body: any): Promise<import("./order.entity").Order>;
}
