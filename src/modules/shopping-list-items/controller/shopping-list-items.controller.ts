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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShoppingListItemDto } from '../dto/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from '../dto/update-shopping-list-item.dto';
import { ShoppingListItemsService } from '../service/shopping-list-items.service';

@ApiTags('Itens das listas de compras')
@Controller('shopping-list-items')
export class ShoppingListItemsController {
  constructor(private readonly service: ShoppingListItemsService) {}

  @Get(':listId/items')
  @ApiOperation({ summary: 'Listar itens das listas de compras' })
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de compras com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão',
  })
  @ApiResponse({
    status: 404,
    description: 'Notfound',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  @ApiResponse({
    status: 503,
    description: 'Serviço Indisponível',
  })
  findAll(@Param('listId', ParseIntPipe) listId: number) {
    return this.service.findAll(listId);
  }

  @Get('shopping-lists/:listId/items/:id')
  @ApiOperation({ summary: 'Buscar item da lista por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 404,
    description: 'Item da lista de compras não encontrado.',
  })
  findById(
    @Param('listId', ParseIntPipe) listId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findById(listId, id);
  }

  @Get(':id/details')
  @ApiOperation({
    summary: 'Buscar lista de compras com seus itens',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de compras com seus itens.',
  })
  @ApiResponse({
    status: 404,
    description: 'Lista de compras não encontrada.',
  })
  findByIdWithItems(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByIdWithItems(id);
  }

  @Get('products/:productId/price-history')
  @ApiOperation({ summary: 'Consultar histórico de preços de um produto' })
  findPriceHistory(@Param('productId', ParseIntPipe) productId: number) {
    return this.service.findPriceHistory(productId);
  }

  @Post('shopping-lists/:listId/items')
  @ApiOperation({ summary: 'Adicionar item a uma lista de compras' })
  @ApiResponse({ status: 201, description: 'Item adicionado à lista.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() data: CreateShoppingListItemDto,
  ) {
    return this.service.add(listId, data);
  }

  @Patch('shopping-lists/:listId/items/:id')
  @ApiOperation({ summary: 'Corrigir o último lançamento de um item da lista' })
  update(
    @Param('listId', ParseIntPipe) listId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateShoppingListItemDto,
  ) {
    return this.service.update(listId, id, data);
  }

  @Delete('shopping-lists/:listId/items/:id')
  @ApiOperation({ summary: 'Remover item da lista' })
  delete(
    @Param('listId', ParseIntPipe) listId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.delete(listId, id);
  }
}
