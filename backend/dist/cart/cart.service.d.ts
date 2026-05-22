import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { ProductsService } from '../products/products.service';
export declare class CartService {
    private cartRepository;
    private productsService;
    constructor(cartRepository: Repository<CartItem>, productsService: ProductsService);
    findBySession(sessionId: string): Promise<{
        id: number;
        name?: string | undefined;
        collection?: string | undefined;
        category?: string | undefined;
        size?: string | undefined;
        price?: number | undefined;
        oldPrice?: number | undefined;
        image?: string | undefined;
        description?: string | undefined;
        brand?: string | undefined;
        productId: number;
        quantity: number;
        sessionId: string;
    }[]>;
    add(productId: number, quantity: number, sessionId: string): Promise<{
        id: number;
        name?: string | undefined;
        collection?: string | undefined;
        category?: string | undefined;
        size?: string | undefined;
        price?: number | undefined;
        oldPrice?: number | undefined;
        image?: string | undefined;
        description?: string | undefined;
        brand?: string | undefined;
        productId: number;
        quantity: number;
        sessionId: string;
    }[]>;
    update(id: number, quantity: number): Promise<void>;
    remove(id: number): Promise<void>;
    clear(sessionId: string): Promise<void>;
}
