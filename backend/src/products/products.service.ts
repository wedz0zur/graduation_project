import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    const count = await this.productsRepository.count();
    if (count === 0) {
      await this.seed();
    }
  }

  async findAll(query: any): Promise<Product[]> {
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
      case 'price-asc': qb = qb.orderBy('product.price', 'ASC'); break;
      case 'price-desc': qb = qb.orderBy('product.price', 'DESC'); break;
      case 'name': qb = qb.orderBy('product.name', 'ASC'); break;
      default: qb = qb.orderBy('product.id', 'ASC');
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productsRepository.findOne({ where: { id } });
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(dto);
    return this.productsRepository.save(product);
  }

  async update(id: number, dto: Partial<CreateProductDto>): Promise<Product | null> {
    await this.productsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }

  private async seed() {
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
}
