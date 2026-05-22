import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService implements OnModuleInit {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    onModuleInit(): Promise<void>;
    findAll(query: any): Promise<Product[]>;
    findOne(id: number): Promise<Product | null>;
    create(dto: CreateProductDto): Promise<Product>;
    update(id: number, dto: Partial<CreateProductDto>): Promise<Product | null>;
    remove(id: number): Promise<void>;
    private seed;
}
