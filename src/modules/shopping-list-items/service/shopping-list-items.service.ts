import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShoppingListItemDto } from '../dto/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from '../dto/update-shopping-list-item.dto';
import { ShoppingListItemsRepository } from '../repository/shopping-list-items.repository';
import { ShoppingListsRepository } from '../../shopping-lists/repository/shopping-lists.repository';
import { ProductsRepository } from '../../products/repository/products.repository';

@Injectable()
export class ShoppingListItemsService {
  constructor(
    private readonly repository: ShoppingListItemsRepository,
    private readonly shoppingListsRepository: ShoppingListsRepository,
    private readonly productRepository: ProductsRepository,
  ) {}

  async findAll(listId: number) {
    await this.ensureListExists(listId);
    return this.repository.findAll(listId);
  }

  async findById(listId: number, id: number) {
    await this.ensureListExists(listId);

    const item = await this.repository.findById(listId, id);

    if (!item) {
      throw new NotFoundException(
        `Item ${id} não encontrado na lista ${listId}.`,
      );
    }

    return item;
  }

  async findByIdWithItems(id: number) {
    const list = await this.repository.findByIdWithItems(id);

    if (!list) {
      throw new NotFoundException(
        `Lista de compras com ID ${id} não encontrada.`,
      );
    }

    return list;
  }

  async add(listId: number, data: CreateShoppingListItemDto) {
    return this.repository.add(listId, data);
  }

  async findPriceHistory(productId: number) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException(
        `Produto com ID ${productId} não encontrado.`,
      );
    }

    return this.repository.findPriceHistory(productId);
  }

  private async ensureListExists(listId: number) {
    const list = await this.shoppingListsRepository.findById(listId);

    if (!list) {
      throw new NotFoundException(
        `Lista de compras com ID ${listId} não encontrada.`,
      );
    }
  }

  async update(
    listId: number,
    itemId: number,
    data: UpdateShoppingListItemDto,
  ) {
    await this.ensureListExists(listId);
    return this.repository.updateLatestEntry(listId, itemId, data);
  }

  async delete(listId: number, itemId: number) {
    await this.ensureListExists(listId);
    await this.repository.deleteItem(listId, itemId);
    return { message: 'Item removido da lista com sucesso.' };
  }
}
