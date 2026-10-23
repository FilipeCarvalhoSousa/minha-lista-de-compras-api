import { Injectable } from "@nestjs/common";
import { products } from "../../../database/schema/products.schema";
import { DatabaseService } from "../../../database/service/database.service";

@Injectable()
export class ProductsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    return this.database.db
      .select()
      .from(products)
      .limit(100);
  }
}
