import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateEstablishmentDto {
  @ApiProperty({ example: 'Supermercado Central' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({
    example: '12345678000199',
    description: 'CNPJ com 14 dígitos, sem pontuação.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{14}$/, {
    message: 'O CNPJ deve conter exatamente 14 dígitos.',
  })
  cnpj?: string;
}