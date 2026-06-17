import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  findBySession(@Query('sessionId') sessionId: string) {
    return this.cartService.findBySession(sessionId);
  }

  @Post()
  add(@Body() body: { productId: number; quantity: number; sessionId: string }) {
    return this.cartService.add(body.productId, body.quantity || 1, body.sessionId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.cartService.update(Number(id), body.quantity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(Number(id));
  }

  @Delete()
  clear(@Query('sessionId') sessionId: string) {
    return this.cartService.clear(sessionId);
  }
}
