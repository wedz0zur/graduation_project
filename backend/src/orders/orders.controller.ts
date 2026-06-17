import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.ordersService.findAll(req.user.id);
  }

  @Post()
  create(@Body() body: any) {
    return this.ordersService.create(body);
  }
}
