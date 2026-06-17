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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async onModuleInit() {
        const count = await this.productsRepository.count();
        if (count === 0) {
            await this.seed();
        }
    }
    async findAll(query) {
        let qb = this.productsRepository.createQueryBuilder('product');
        if (query.category && query.category !== 'all') {
            qb = qb.andWhere('product.category = :category', { category: query.category });
        }
        if (query.brand && query.brand !== 'all') {
            qb = qb.andWhere('product.brand = :brand', { brand: query.brand });
        }
        if (query.sale === 'true') {
            qb = qb.andWhere('product.oldPrice IS NOT NULL');
        }
        if (query.minPrice) {
            qb = qb.andWhere('product.price >= :minPrice', { minPrice: Number(query.minPrice) });
        }
        if (query.maxPrice) {
            qb = qb.andWhere('product.price <= :maxPrice', { maxPrice: Number(query.maxPrice) });
        }
        switch (query.sort) {
            case 'price-asc':
                qb = qb.orderBy('product.price', 'ASC');
                break;
            case 'price-desc':
                qb = qb.orderBy('product.price', 'DESC');
                break;
            case 'name':
                qb = qb.orderBy('product.name', 'ASC');
                break;
            default: qb = qb.orderBy('product.id', 'ASC');
        }
        return qb.getMany();
    }
    async findOne(id) {
        return this.productsRepository.findOne({ where: { id } });
    }
    async create(dto) {
        const product = this.productsRepository.create(dto);
        return this.productsRepository.save(product);
    }
    async update(id, dto) {
        await this.productsRepository.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.productsRepository.delete(id);
    }
    async seed() {
        const products = [
            { name: 'Porcelanosa Artemix', collection: 'Artemix', category: 'keramogranit', size: '60×120 см', price: 4500, oldPrice: 5200, image: '/images/products/Porcelanosa_Artemix.jpg', description: 'Керамогранит с дизайном натурального мрамора. Идеален для пола и стен в гостиных, холлах и коммерческих помещениях.', brand: 'Porcelanosa' },
            { name: 'Italon Prestige', collection: 'Prestige', category: 'keramogranit', size: '80×80 см', price: 3800, image: '/images/products/Italon_Prestige.jpeg', description: 'Премиальный керамогранит с эффектом бетона. Высокая износостойкость, подходит для коммерческих помещений.', brand: 'Italon' },
            { name: 'Cezares Stone', collection: 'Stone Collection', category: 'keramogranit', size: '60×60 см', price: 3200, image: '/images/products/Cezares_Stone.jpg', description: 'Керамогранит под натуральный камень. Прочный и износостойкий.', brand: 'Cezares' },
            { name: 'Keramin Impression', collection: 'Impression', category: 'ceramic-tile', size: '33×33 см', price: 1800, image: '/images/products/Keramin_Impression.jpg', description: 'Керамическая плитка с ярким дизайном. Отлично подходит для ванных комнат и кухонь.', brand: 'Keramin' },
            { name: 'Grasaro Marmo', collection: 'Marmo Classico', category: 'large-formats', size: '120×278 см', price: 12000, image: '/images/products/Grasaro_Marmo.jpg', description: 'Крупноформатный керамогранит с дизайном натурального мрамора. Создаёт бесшовное покрытие.', brand: 'Grasaro' },
            { name: 'Italon Wood', collection: 'Wood Style', category: 'keramogranit', size: '20×120 см', price: 2900, oldPrice: 3500, image: '/images/products/Italon_Wood.jpg', description: 'Керамогранит под натуральное дерево. Тёплая текстура и высокая износостойкость.', brand: 'Italon' },
            { name: 'Cezares Marble Lux', collection: 'Marble Lux', category: 'large-formats', size: '120×260 см', price: 15000, image: '/images/products/Cezares_Marble_Lux.jpg', description: 'Элитный крупноформатный керамогранит с мраморным дизайном. Премиум-сегмент.', brand: 'Cezares' },
            { name: 'Keramin Basic', collection: 'Basic Line', category: 'ceramic-tile', size: '25×40 см', price: 1200, image: '/images/products/Keramin_Basic.jpg', description: 'Базовая коллекция керамической плитки. Отличное соотношение цены и качества.', brand: 'Keramin' },
            { name: 'Italon Concrete', collection: 'Concrete Lab', category: 'large-formats', size: '60×120 см', price: 4100, image: '/images/products/Italon_Concrete.jpg', description: 'Керамогранит с эффектом бетона в стиле лофт. Матовая поверхность, высокая износостойкость PEI V.', brand: 'Italon' },
            { name: 'Grasaro Travertino', collection: 'Travertino Classico', category: 'keramogranit', size: '60×90 см', price: 5600, image: '/images/products/Grasaro_Travertino.jpg', description: 'Керамогранит под натуральный травертин. Тёплые природные оттенки для уютного интерьера.', brand: 'Grasaro' },
        ];
        await this.productsRepository.save(products);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map