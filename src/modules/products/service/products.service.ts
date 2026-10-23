import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repository/products.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: number) {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new NotFoundException(
        `Produto com ID ${id} não encontrado.`,
      );
    }

    return product;
  }

  async create(data: CreateProductDto) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateProductDto) {
    await this.findById(id);

    return this.repository.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id);

    await this.repository.delete(id);

    return {
      message: 'Produto excluído com sucesso.',
    };
  }
}
