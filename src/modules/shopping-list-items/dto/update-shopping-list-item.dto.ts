import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateShoppingListItemDto } from './create-shopping-list-item.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateShoppingListItemDto extends PartialType(
  CreateShoppingListItemDto,
) {
  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity?: number;

  @ApiPropertyOptional({ example: 5.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountAmount?: number;
}
