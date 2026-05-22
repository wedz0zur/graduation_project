import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerPhone: string;

  @Column({ nullable: true })
  customerEmail: string;

  @Column('float', { default: 0 })
  total: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: () => "datetime('now')" })
  createdAt: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
