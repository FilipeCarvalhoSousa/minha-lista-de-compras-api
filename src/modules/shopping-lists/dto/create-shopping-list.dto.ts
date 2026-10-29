import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateShoppingListItemDto } from '../../shopping-list-items/dto/create-shopping-list-item.dto';

export class CreateShoppingListDto {
  @ApiProperty({ example: 'Compras da semana' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ enum: ['manual', 'imported'], default: 'manual' })
  @IsOptional()
  @IsIn(['manual', 'imported'])
  source?: 'manual' | 'imported';

  @ApiPropertyOptional({ example: '2026-10-23T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  purchasedAt?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  establishmentId?: number;

  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  invoiceNumber?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  invoiceSeries?: string;

  @ApiPropertyOptional({
    example: '12345678901234567890123456789012345678901234',
  })
  @IsOptional()
  @IsString()
  @MaxLength(44)
  invoiceAccessKey?: string;

  @ApiPropertyOptional({
    type: [CreateShoppingListItemDto],
    description: 'Itens que serão incluídos na lista.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShoppingListItemDto)
  items?: CreateShoppingListItemDto[];
}
