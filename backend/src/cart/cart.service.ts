import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}

  async findBySession(sessionId: string) {
    const items = await this.cartRepository.find({ where: { sessionId } });
    const enriched = [];
    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);
      enriched.push({ ...item, ...product });
    }
    return enriched;
  }

  async add(productId: number, quantity: number, sessionId: string) {
    const existing = await this.cartRepository.findOne({ where: { productId, sessionId } });
    if (existing) {
      existing.quantity += quantity;
      await this.cartRepository.save(existing);
    } else {
      const item = this.cartRepository.create({ productId, quantity, sessionId });
      await this.cartRepository.save(item);
    }
    return this.findBySession(sessionId);
  }

  async update(id: number, quantity: number) {
    if (quantity <= 0) {
      await this.cartRepository.delete(id);
    } else {
      await this.cartRepository.update(id, { quantity });
    }
  }

  async remove(id: number) {
    await this.cartRepository.delete(id);
  }

  async clear(sessionId: string) {
    await this.cartRepository.delete({ sessionId });
  }
}
