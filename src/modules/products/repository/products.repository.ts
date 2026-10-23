import { Injectable } from "@nestjs/common";
import { products } from "../../../database/schema/products.schema";
import { DatabaseService } from "../../../database/service/database.service";
import { eq } from "drizzle-orm";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";

@Injectable()
export class ProductsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    return this.database.db
      .select()
      .from(products)
      .limit(100);
  }

  async findById(id: number) {
    const [product] = await this.database.db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return product;
  }

  async create(data: CreateProductDto) {
    const [product] = await this.database.db
      .insert(products)
      .values({
        description: data.description,
        brand: data.brand,
        barcode: data.barcode,
        unit: data.unit ?? 'UN',
      })
      .returning();

    return product;
  }

  async update(id: number, data: UpdateProductDto) {
    const [product] = await this.database.db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();

    return product;
  }

  async delete(id: number) {
    const [product] = await this.database.db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    return product;
  }
}
