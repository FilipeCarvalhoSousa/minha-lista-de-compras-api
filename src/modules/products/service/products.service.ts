import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repository/products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async findAll() {
    return this.repository.findAll();
  }
}
