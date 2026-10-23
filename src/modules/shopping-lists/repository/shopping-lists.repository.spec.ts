import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../../database/service/database.service';
import { ShoppingListsRepository } from './shopping-lists.repository';

describe('ShoppingListsRepository', () => {
  let repository: ShoppingListsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListsRepository,
        { provide: DatabaseService, useValue: { db: {} } },
      ],
    }).compile();

    repository = module.get<ShoppingListsRepository>(ShoppingListsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
