import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductsService } from '../service/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@ApiTags('Produtos')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar produtos cadastrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso.',
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Post() 
  @ApiOperation({ summary: 'Cadastrar produto' }) 
  @ApiResponse({ status: 201, description: 'Produto cadastrado.' }) 
  @ApiResponse({ status: 400, description: 'Dados inválidos.' }) 
  create(@Body() data: CreateProductDto) { 
    return this.productsService.create(data); 
  } 
  
  @Get(':id') 
  @ApiOperation({ summary: 'Buscar produto por ID' }) 
  @ApiParam({ name: 'id', type: Number }) 
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' }) 
  findById(@Param('id', ParseIntPipe) id: number) { 
    return this.productsService.findById(id); 
  } 
  
  @Patch(':id') 
  @ApiOperation({ summary: 'Atualizar produto' }) 
  @ApiParam({ name: 'id', type: Number }) 
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' }) 
  update( 
    @Param('id', ParseIntPipe) id: number, 
    @Body() data: UpdateProductDto, 
  ) { 
    return this.productsService.update(id, data); 
  } 
  
  @Delete(':id') 
  @ApiOperation({ summary: 'Excluir produto' }) 
  @ApiParam({ name: 'id', type: Number }) 
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' }) 
  delete(@Param('id', ParseIntPipe) id: number) { 
    return this.productsService.delete(id); 
  }
}

