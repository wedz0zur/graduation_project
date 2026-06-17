"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_item_entity_1 = require("./cart-item.entity");
const products_service_1 = require("../products/products.service");
let CartService = class CartService {
    constructor(cartRepository, productsService) {
        this.cartRepository = cartRepository;
        this.productsService = productsService;
    }
    async findBySession(sessionId) {
        const items = await this.cartRepository.find({ where: { sessionId } });
        const enriched = [];
        for (const item of items) {
            const product = await this.productsService.findOne(item.productId);
            enriched.push({ ...item, ...product });
        }
        return enriched;
    }
    async add(productId, quantity, sessionId) {
        const existing = await this.cartRepository.findOne({ where: { productId, sessionId } });
        if (existing) {
            existing.quantity += quantity;
            await this.cartRepository.save(existing);
        }
        else {
            const item = this.cartRepository.create({ productId, quantity, sessionId });
            await this.cartRepository.save(item);
        }
        return this.findBySession(sessionId);
    }
    async update(id, quantity) {
        if (quantity <= 0) {
            await this.cartRepository.delete(id);
        }
        else {
            await this.cartRepository.update(id, { quantity });
        }
    }
    async remove(id) {
        await this.cartRepository.delete(id);
    }
    async clear(sessionId) {
        await this.cartRepository.delete({ sessionId });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        products_service_1.ProductsService])
], CartService);
//# sourceMappingURL=cart.service.js.map