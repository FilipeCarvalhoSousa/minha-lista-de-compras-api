import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../../database/service/database.service';
import { ShoppingListItemsRepository } from './shopping-list-items.repository';

describe('ShoppingListItemsRepository', () => {
  let repository: ShoppingListItemsRepository;
  let database: {
    db: {
      select: jest.Mock;
      from: jest.Mock;
      orderBy: jest.Mock;
      where: jest.Mock;
      limit: jest.Mock;
      insert: jest.Mock;
      values: jest.Mock;
      update: jest.Mock;
      set: jest.Mock;
      delete: jest.Mock;
      returning: jest.Mock;
    };
  };

  beforeEach(async () => {
    const queryResult = [{ id: 1 }];
    const returning = jest.fn().mockResolvedValue(queryResult);
    const orderBy = jest.fn().mockResolvedValue(queryResult);
    const limit = jest.fn().mockResolvedValue(queryResult);
    const where = jest.fn().mockReturnValue({ limit, returning });
    const from = jest.fn().mockReturnValue({ orderBy, where });
    const values = jest.fn().mockReturnValue({ returning });
    const set = jest.fn().mockReturnValue({ where });

    database = {
      db: {
        select: jest.fn().mockReturnValue({ from }),
        from,
        orderBy,
        where,
        limit,
        insert: jest.fn().mockReturnValue({ values }),
        values,
        update: jest.fn().mockReturnValue({ set }),
        set,
        delete: jest.fn().mockReturnValue({ where }),
        returning,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListItemsRepository,
        { provide: DatabaseService, useValue: database },
      ],
    }).compile();

    repository = module.get<ShoppingListItemsRepository>(
      ShoppingListItemsRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('lists items ordered by ID', async () => {
    await expect(repository.findAll()).resolves.toEqual([{ id: 1 }]);
    expect(database.db.orderBy).toHaveBeenCalledTimes(1);
  });

  it('finds an item by ID', async () => {
    await expect(repository.findById(1)).resolves.toEqual({ id: 1 });
    expect(database.db.where).toHaveBeenCalledTimes(1);
    expect(database.db.limit).toHaveBeenCalledWith(1);
  });

  it('creates an item and converts numeric fields to strings', async () => {
    const data = {
      shoppingListId: 1,
      productId: 2,
      quantity: 2.5,
      unitPrice: 10.25,
      discountAmount: 1.25,
      totalPrice: 24.38,
    };

    await expect(repository.create(data)).resolves.toEqual({ id: 1 });
    expect(database.db.values).toHaveBeenCalledWith({
      shoppingListId: 1,
      productId: 2,
      quantity: '2.5',
      unitPrice: '10.25',
      discountAmount: '1.25',
      totalPrice: '24.38',
    });
  });

  it('updates an item', async () => {
    await expect(repository.update(1, { quantity: 3 })).resolves.toEqual({
      id: 1,
    });
    expect(database.db.set).toHaveBeenCalledWith({
      shoppingListId: undefined,
      productId: undefined,
      quantity: '3',
      unitPrice: undefined,
      discountAmount: undefined,
      totalPrice: undefined,
    });
  });

  it('deletes an item', async () => {
    await expect(repository.delete(1)).resolves.toEqual({ id: 1 });
    expect(database.db.delete).toHaveBeenCalledTimes(1);
    expect(database.db.returning).toHaveBeenCalledTimes(1);
  });
});
