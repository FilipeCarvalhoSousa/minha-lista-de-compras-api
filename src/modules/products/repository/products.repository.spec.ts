import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../../database/service/database.service';
import { ProductsRepository } from './products.repository';

describe('ProductsRepository', () => {
  let repository: ProductsRepository;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsRepository,
        { provide: DatabaseService, useValue: { db: {} } },
      ],
    }).compile();

    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
