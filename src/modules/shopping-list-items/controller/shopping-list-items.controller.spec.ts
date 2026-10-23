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
      providers: [
        { provide: ShoppingListItemsService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<ShoppingListItemsController>(
      ShoppingListItemsController,
    );
    service = module.get(ShoppingListItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates list retrieval to the service', () => {
    service.findAll.mockReturnValue([]);

    expect(controller.findAll()).toEqual([]);
    expect(service.findAll.mock.calls).toHaveLength(1);
  });

  it('delegates creation to the service', () => {
    const data = {
      shoppingListId: 1,
      productId: 2,
      unitPrice: 10,
      totalPrice: 20,
    };
    service.create.mockReturnValue(data as never);

    expect(controller.create(data)).toBe(data);
    expect(service.create.mock.calls[0]).toEqual([data]);
  });

  it('delegates retrieval by ID to the service', () => {
    const item = { id: 1, productId: 2 };
    service.findById.mockReturnValue(item as never);

    expect(controller.findById(1)).toBe(item);
    expect(service.findById.mock.calls[0]).toEqual([1]);
  });

  it('delegates updates to the service', () => {
    const data = { quantity: 3 };
    const item = { id: 1, ...data };
    service.update.mockReturnValue(item as never);

    expect(controller.update(1, data)).toBe(item);
    expect(service.update.mock.calls[0]).toEqual([1, data]);
  });

  it('delegates deletion to the service', () => {
    const result = { message: 'Item da lista de compras excluído com sucesso.' };
    service.delete.mockReturnValue(result as never);

    expect(controller.delete(1)).toBe(result);
    expect(service.delete.mock.calls[0]).toEqual([1]);
  });
});
