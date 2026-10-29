import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListItemsService } from '../service/shopping-list-items.service';
import { ShoppingListItemsController } from './shopping-list-items.controller';

describe('ShoppingListItemsController', () => {
  let controller: ShoppingListItemsController;
  let service: jest.Mocked<ShoppingListItemsService>;

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListItemsController],
      providers: [{ provide: ShoppingListItemsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ShoppingListItemsController>(
      ShoppingListItemsController,
    );
    service = module.get(ShoppingListItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates list retrieval to the service', async () => {
    service.findAll.mockResolvedValue([] as never);

    await expect(controller.findAll(1)).resolves.toEqual([]);
    expect(service.findAll.mock.calls).toHaveLength(1);
  });

  it('delegates retrieval by ID to the service', async () => {
    const item = { id: 1, productId: 2 };
    service.findById.mockResolvedValue(item as never);

    await expect(controller.findById(1, 1)).resolves.toBe(item);
    expect(service.findById.mock.calls[0]).toEqual([1]);
  });

  it('delegates updates to the service', async () => {
    const data = { quantity: 3 };
    const item = { id: 1, ...data };
    service.update.mockResolvedValue(item as never);

    await expect(controller.update(1, 1, data)).resolves.toBe(item);
    expect(service.update.mock.calls[0]).toEqual([1, data]);
  });

  it('delegates deletion to the service', async () => {
    const result = {
      message: 'Item da lista de compras excluído com sucesso.',
    };
    service.delete.mockResolvedValue(result as never);

    await expect(controller.delete(1, 1)).resolves.toBe(result);
    expect(service.delete.mock.calls[0]).toEqual([1]);
  });
});
