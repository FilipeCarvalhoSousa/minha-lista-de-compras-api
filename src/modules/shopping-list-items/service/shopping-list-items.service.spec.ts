import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListItemsRepository } from '../repository/shopping-list-items.repository';
import { ShoppingListItemsService } from './shopping-list-items.service';

describe('ShoppingListItemsService', () => {
  let service: ShoppingListItemsService;
  let repository: jest.Mocked<ShoppingListItemsRepository>;

  beforeEach(async () => {
    const repositoryMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListItemsService,
        { provide: ShoppingListItemsRepository, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<ShoppingListItemsService>(ShoppingListItemsService);
    repository = module.get(ShoppingListItemsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns all shopping list items', async () => {
    const items = [{ id: 1, shoppingListId: 1, productId: 2 }];
    repository.findAll.mockResolvedValue(items as never);

    await expect(service.findAll()).resolves.toBe(items);
  });

  it('returns a shopping list item by ID', async () => {
    const item = { id: 1, shoppingListId: 1, productId: 2 };
    repository.findById.mockResolvedValue(item as never);

    await expect(service.findById(1)).resolves.toBe(item);
  });

  it('throws when the shopping list item does not exist', async () => {
    repository.findById.mockResolvedValue(undefined);

    await expect(service.findById(42)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a shopping list item', async () => {
    const data = {
      shoppingListId: 1,
      productId: 2,
      unitPrice: 10,
      totalPrice: 20,
    };
    repository.create.mockResolvedValue({ id: 1, ...data } as never);

    await expect(service.create(data)).resolves.toEqual({ id: 1, ...data });
    expect(repository.create.mock.calls[0]).toEqual([data]);
  });

  it('updates an existing shopping list item', async () => {
    const data = { quantity: 3 };
    repository.findById.mockResolvedValue({ id: 1 } as never);
    repository.update.mockResolvedValue({ id: 1, ...data } as never);

    await expect(service.update(1, data)).resolves.toEqual({ id: 1, ...data });
    expect(repository.update.mock.calls[0]).toEqual([1, data]);
  });

  it('does not update a missing shopping list item', async () => {
    repository.findById.mockResolvedValue(undefined);

    await expect(service.update(42, { quantity: 3 })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repository.update.mock.calls).toHaveLength(0);
  });

  it('deletes an existing shopping list item', async () => {
    repository.findById.mockResolvedValue({ id: 1 } as never);
    repository.delete.mockResolvedValue({ id: 1 } as never);

    await expect(service.delete(1)).resolves.toEqual({
      message: 'Item da lista de compras excluído com sucesso.',
    });
    expect(repository.delete.mock.calls[0]).toEqual([1]);
  });

  it('does not delete a missing shopping list item', async () => {
    repository.findById.mockResolvedValue(undefined);

    await expect(service.delete(42)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.delete.mock.calls).toHaveLength(0);
  });
});
