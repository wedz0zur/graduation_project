import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async findAll(userId?: number): Promise<Order[]> {
    if (userId) {
      return this.ordersRepository.find({
        where: { userId },
        relations: ['items', 'items.product'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.ordersRepository.find({
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: {
    userId?: number;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    items: { productId: number; quantity: number }[];
  }): Promise<Order> {
    let total = 0;
    const orderItems: OrderItem[] = [];

    for (const item of data.items) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const price = product.price;
      total += price * item.quantity;
      const oi = this.orderItemsRepository.create({ productId: item.productId, quantity: item.quantity, price });
      orderItems.push(oi);
    }

    const order = this.ordersRepository.create({
      userId: data.userId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      total,
      status: 'pending',
    });

    const saved = await this.ordersRepository.save(order);

    for (const oi of orderItems) {
      oi.orderId = saved.id;
      await this.orderItemsRepository.save(oi);
    }

    return this.ordersRepository.findOne({ where: { id: saved.id }, relations: ['items', 'items.product'] }) as Promise<Order>;
  }
}
