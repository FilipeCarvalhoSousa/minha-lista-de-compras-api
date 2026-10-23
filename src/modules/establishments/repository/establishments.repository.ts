import { Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { establishments } from '../../../database/schema';
import { DatabaseService } from '../../../database/service/database.service';
import { CreateEstablishmentDto } from '../dto/create-establishment.dto';
import { UpdateEstablishmentDto } from '../dto/update-establishment.dto';

@Injectable()
export class EstablishmentsRepository {
   constructor(
    private readonly database: DatabaseService,
  ) {}

  async findAll() {
    return this.database.db
      .select()
      .from(establishments)
      .orderBy(asc(establishments.id));
  }

  async findById(id: number) {
    const [establishment] = await this.database.db
      .select()
      .from(establishments)
      .where(eq(establishments.id, id))
      .limit(1);

    return establishment;
  }

  async findByCnpj(cnpj: string) {
    const [establishment] = await this.database.db
      .select()
      .from(establishments)
      .where(eq(establishments.cnpj, cnpj))
      .limit(1);

    return establishment;
  }

  async create(data: CreateEstablishmentDto) {
    const [establishment] = await this.database.db
      .insert(establishments)
      .values({
        name: data.name,
        cnpj: data.cnpj,
      })
      .returning();

    return establishment;
  }

  async update(id: number, data: UpdateEstablishmentDto) {
    const [establishment] = await this.database.db
      .update(establishments)
      .set(data)
      .where(eq(establishments.id, id))
      .returning();

    return establishment;
  }

  async delete(id: number) {
    const [establishment] = await this.database.db
      .delete(establishments)
      .where(eq(establishments.id, id))
      .returning();

    return establishment;
  }
}
