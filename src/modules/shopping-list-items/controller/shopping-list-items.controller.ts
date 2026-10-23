import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateShoppingListItemDto } from '../dto/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from '../dto/update-shopping-list-item.dto';
import { ShoppingListItemsService } from '../service/shopping-list-items.service';

@ApiTags('Itens das listas de compras')
@Controller('shopping-list-items')
export class ShoppingListItemsController {
  constructor(private readonly service: ShoppingListItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar item a uma lista de compras' })
  @ApiResponse({ status: 201, description: 'Item adicionado à lista.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() data: CreateShoppingListItemDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar itens das listas de compras' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar item da lista por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 404,
    description: 'Item da lista de compras não encontrado.',
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar item da lista de compras' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 404,
    description: 'Item da lista de compras não encontrado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateShoppingListItemDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover item da lista de compras' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 404,
    description: 'Item da lista de compras não encontrado.',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
