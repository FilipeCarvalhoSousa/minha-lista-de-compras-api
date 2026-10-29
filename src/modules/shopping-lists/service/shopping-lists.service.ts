import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from '../dto/update-shopping-list.dto';
import { ShoppingListsRepository } from '../repository/shopping-lists.repository';
import { EstablishmentsRepository } from '../../establishments/repository/establishments.repository';

@Injectable()
export class ShoppingListsService {
  constructor(
    private readonly repository: ShoppingListsRepository,
    private readonly establishmentsRepository: EstablishmentsRepository,
  ) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: number) {
    const shoppingList = await this.repository.findById(id);

    if (!shoppingList) {
      throw new NotFoundException(
        `Lista de compras com ID ${id} não encontrada.`,
      );
    }

    return shoppingList;
  }

  async create(data: CreateShoppingListDto) {
    if (data.invoiceAccessKey) {
      const existing = await this.repository.findByInvoiceAccessKey(
        data.invoiceAccessKey,
      );

      if (existing) {
        throw new ConflictException(
          'Já existe uma lista de compras cadastrada com essa chave de acesso.',
        );
      }
    }
    await this.validateEstablishment(data.establishmentId);
    await this.validateInvoiceAccessKey(data.invoiceAccessKey);

    return this.repository.createWithItems(data);
  }

  async update(id: number, data: UpdateShoppingListDto) {
    await this.findById(id);

    if (data.invoiceAccessKey) {
      const existing = await this.repository.findByInvoiceAccessKey(
        data.invoiceAccessKey,
      );

      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Já existe outra lista de compras cadastrada com essa chave de acesso.',
        );
      }
    }

    return this.repository.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id);
    await this.repository.delete(id);

    return {
      message: 'Lista de compras excluída com sucesso.',
    };
  }

  private async validateEstablishment(establishmentId?: number | null) {
    if (establishmentId == null) {
      return;
    }

    const establishment =
      await this.establishmentsRepository.findById(establishmentId);

    if (!establishment) {
      throw new NotFoundException(
        `Estabelecimento com ID ${establishmentId} não encontrado.`,
      );
    }
  }

  private async validateInvoiceAccessKey(
    invoiceAccessKey?: string | null,
    currentListId?: number,
  ) {
    if (!invoiceAccessKey) {
      return;
    }

    const existing =
      await this.repository.findByInvoiceAccessKey(invoiceAccessKey);

    if (existing && existing.id !== currentListId) {
      throw new ConflictException(
        'Essa chave de acesso da nota fiscal já está vinculada a outra lista.',
      );
    }
  }
}
