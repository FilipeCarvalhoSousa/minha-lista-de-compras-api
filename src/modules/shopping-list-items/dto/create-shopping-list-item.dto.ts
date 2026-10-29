import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateProductDto } from '../../products/dto/create-product.dto';

export class CreateShoppingListItemDto {
  @ApiPropertyOptional({ example: 10 })
  @ValidateIf((o) => o.newProduct == null)
  @IsInt()
  @Min(1)
  productId?: number;

  @ApiPropertyOptional({ type: CreateProductDto })
  @ValidateIf((o) => o.productId == null)
  @ValidateNested()
  @Type(() => CreateProductDto)
  newProduct?: CreateProductDto;

  @ApiProperty({ example: 2 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity: number;

  @ApiProperty({ example: 5.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountAmount?: number;
}
