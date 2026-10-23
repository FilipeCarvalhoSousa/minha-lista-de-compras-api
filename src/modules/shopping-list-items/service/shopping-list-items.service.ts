import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShoppingListItemDto } from '../dto/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from '../dto/update-shopping-list-item.dto';
import { ShoppingListItemsRepository } from '../repository/shopping-list-items.repository';

@Injectable()
export class ShoppingListItemsService {
  constructor(private readonly repository: ShoppingListItemsRepository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: number) {
    const shoppingListItem = await this.repository.findById(id);

    if (!shoppingListItem) {
      throw new NotFoundException(
        `Item da lista de compras com ID ${id} não encontrado.`,
      );
    }

    return shoppingListItem;
  }

  async create(data: CreateShoppingListItemDto) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateShoppingListItemDto) {
    await this.findById(id);

    return this.repository.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id);
    await this.repository.delete(id);

    return {
      message: 'Item da lista de compras excluído com sucesso.',
    };
  }
}
