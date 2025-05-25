import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './DTO/create.dto';
import { UpdateProductDto } from './DTO/update.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      createdBy: userId,
    });
    return await this.productRepository.save(product);
  }

  async findall() {
    const products = this.productRepository.find({
      where: { isActive: true },
    });

    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    userId: number,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (product.createdBy !== userId) {
      throw new ForbiddenException('You can only update your own products');
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number, userId: number): Promise<void> {
    const product = await this.findOne(id);

    if (product.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    product.isActive = false;
    await this.productRepository.save(product);
  }
}
