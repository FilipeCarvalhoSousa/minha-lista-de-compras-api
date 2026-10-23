import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Arroz branco 5kg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  description: string;

  @ApiPropertyOptional({ example: 'Tio João' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  brand?: string;

  @ApiPropertyOptional({ example: '7891234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(14)
  barcode?: string;

  @ApiPropertyOptional({ example: 'UN', default: 'UN' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit?: string;
}