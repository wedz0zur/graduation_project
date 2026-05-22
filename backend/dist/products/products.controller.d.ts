import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(query: any): Promise<import("./product.entity").Product[]>;
    findOne(id: string): Promise<import("./product.entity").Product | null>;
    create(dto: CreateProductDto): Promise<import("./product.entity").Product>;
    update(id: string, dto: Partial<CreateProductDto>): Promise<import("./product.entity").Product | null>;
    remove(id: string): Promise<void>;
}
