import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column({ default: 1 })
  quantity: number;

  @Column()
  sessionId: string;
}
