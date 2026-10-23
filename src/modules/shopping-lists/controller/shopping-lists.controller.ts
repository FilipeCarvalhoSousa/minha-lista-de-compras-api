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
import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from '../dto/update-shopping-list.dto';
import { ShoppingListsService } from '../service/shopping-lists.service';

@ApiTags('Listas de compras')
@Controller('shopping-lists')
export class ShoppingListsController {
  constructor(private readonly service: ShoppingListsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar lista de compras' })
  @ApiResponse({ status: 201, description: 'Lista de compras cadastrada.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Chave de acesso já cadastrada.' })
  create(@Body() data: CreateShoppingListDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar listas de compras' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar lista de compras por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Lista de compras não encontrada.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar lista de compras' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Lista de compras não encontrada.' })
  @ApiResponse({ status: 409, description: 'Chave de acesso já cadastrada.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateShoppingListDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir lista de compras' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Lista de compras não encontrada.' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
