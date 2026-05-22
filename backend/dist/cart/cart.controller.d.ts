import { CartService } from './cart.service';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
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
    add(body: {
        productId: number;
        quantity: number;
        sessionId: string;
    }): Promise<{
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
    update(id: string, body: {
        quantity: number;
    }): Promise<void>;
    remove(id: string): Promise<void>;
    clear(sessionId: string): Promise<void>;
}
