import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEstablishmentDto } from '../dto/create-establishment.dto';
import { UpdateEstablishmentDto } from '../dto/update-establishment.dto';
import { EstablishmentsService } from '../service/establishments.service';

@ApiTags('Estabelecimentos')
@Controller('establishments')
export class EstablishmentsController {
  constructor(
    private readonly service: EstablishmentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar estabelecimento' })
  @ApiResponse({ status: 201, description: 'Estabelecimento cadastrado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado.' })
  create(@Body() data: CreateEstablishmentDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar estabelecimentos' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar estabelecimento por ID' })
  @ApiParam({ name: 'id', type: Number })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar estabelecimento' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Estabelecimento não encontrado.' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEstablishmentDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir estabelecimento' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Estabelecimento não encontrado.' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
