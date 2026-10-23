import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListsController } from './shopping-lists.controller';
import { ShoppingListsService } from '../service/shopping-lists.service';

describe('ShoppingListsController', () => {
  let controller: ShoppingListsController;
  let service: jest.Mocked<ShoppingListsService>;

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListsController],
      providers: [{ provide: ShoppingListsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ShoppingListsController>(ShoppingListsController);
    service = module.get(ShoppingListsService);
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
    const data = { name: 'Compras da semana' };
    service.create.mockReturnValue(data as never);

    expect(controller.create(data)).toBe(data);
    expect(service.create.mock.calls[0]).toEqual([data]);
  });

  it('delegates retrieval by ID to the service', () => {
    const shoppingList = { id: 1, name: 'Compras da semana' };
    service.findById.mockReturnValue(shoppingList as never);

    expect(controller.findById(1)).toBe(shoppingList);
    expect(service.findById.mock.calls[0]).toEqual([1]);
  });

  it('delegates updates to the service', () => {
    const data = { name: 'Compras do mês' };
    const shoppingList = { id: 1, ...data };
    service.update.mockReturnValue(shoppingList as never);

    expect(controller.update(1, data)).toBe(shoppingList);
    expect(service.update.mock.calls[0]).toEqual([1, data]);
  });

  it('delegates deletion to the service', () => {
    const result = { message: 'Lista de compras excluída com sucesso.' };
    service.delete.mockReturnValue(result as never);

    expect(controller.delete(1)).toBe(result);
    expect(service.delete.mock.calls[0]).toEqual([1]);
  });
});
