import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  collection: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  size: string;

  @Column('float')
  price: number;

  @Column({ nullable: true, type: 'float' })
  oldPrice: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  brand: string;
}
