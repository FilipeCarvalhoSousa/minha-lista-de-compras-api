import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstablishmentDto } from '../dto/create-establishment.dto';
import { UpdateEstablishmentDto } from '../dto/update-establishment.dto';
import { EstablishmentsRepository } from '../repository/establishments.repository';

@Injectable()
export class EstablishmentsService {
  constructor(
    private readonly repository: EstablishmentsRepository,
  ) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: number) {
    const establishment = await this.repository.findById(id);

    if (!establishment) {
      throw new NotFoundException(
        `Estabelecimento com ID ${id} não encontrado.`,
      );
    }

    return establishment;
  }

  async create(data: CreateEstablishmentDto) {
    if (data.cnpj) {
      const existing = await this.repository.findByCnpj(data.cnpj);

      if (existing) {
        throw new ConflictException(
          'Já existe um estabelecimento cadastrado com esse CNPJ.',
        );
      }
    }

    return this.repository.create(data);
  }

  async update(id: number, data: UpdateEstablishmentDto) {
    await this.findById(id);

    if (data.cnpj) {
      const existing = await this.repository.findByCnpj(data.cnpj);

      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Já existe outro estabelecimento cadastrado com esse CNPJ.',
        );
      }
    }

    return this.repository.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id);

    await this.repository.delete(id);

    return {
      message: 'Estabelecimento excluído com sucesso.',
    };
  }
}
