import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListsRepository } from '../repository/shopping-lists.repository';
import { ShoppingListsService } from './shopping-lists.service';

describe('ShoppingListsService', () => {
  let service: ShoppingListsService;
  let repository: jest.Mocked<ShoppingListsRepository>;

  beforeEach(async () => {
    const repositoryMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByInvoiceAccessKey: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListsService,
        { provide: ShoppingListsRepository, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<ShoppingListsService>(ShoppingListsService);
    repository = module.get(ShoppingListsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns all shopping lists', async () => {
    const shoppingLists = [{ id: 1, name: 'Compras da semana' }];
    repository.findAll.mockResolvedValue(shoppingLists as never);

    await expect(service.findAll()).resolves.toBe(shoppingLists);
  });

  it('throws when a shopping list does not exist', async () => {
    repository.findById.mockResolvedValue(undefined);

    await expect(service.findById(42)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects creation when the invoice access key is already used', async () => {
    repository.findByInvoiceAccessKey.mockResolvedValue({ id: 1 } as never);

    await expect(
      service.create({
        name: 'Compras da semana',
        invoiceAccessKey: '12345678901234567890123456789012345678901234',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repository.create.mock.calls).toHaveLength(0);
  });

  it('rejects updates when another list uses the invoice access key', async () => {
    repository.findById.mockResolvedValue({ id: 2 } as never);
    repository.findByInvoiceAccessKey.mockResolvedValue({ id: 1 } as never);

    await expect(
      service.update(2, {
        invoiceAccessKey: '12345678901234567890123456789012345678901234',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repository.update.mock.calls).toHaveLength(0);
  });

  it('deletes an existing shopping list', async () => {
    repository.findById.mockResolvedValue({ id: 1 } as never);
    repository.delete.mockResolvedValue({ id: 1 } as never);

    await expect(service.delete(1)).resolves.toEqual({
      message: 'Lista de compras excluída com sucesso.',
    });
    expect(repository.delete.mock.calls[0]).toEqual([1]);
  });
});
