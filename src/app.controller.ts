import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @Redirect('/api/docs', 302)
  @ApiOperation({ summary: 'Redireciona para a documentação da API' })
  @ApiResponse({ status: 302, description: 'Redireciona para o Swagger UI.' })
  redirectToDocs(): void {}

  @Get('health')
  @ApiOperation({ summary: 'Verifica a saúde da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'A aplicação está em execução.',
    schema: { example: { status: 'ok' } },
  })
  getHealth(): { status: string } {
    return { status: 'ok' };
  }

  @Get('version')
  @ApiOperation({ summary: 'Retorna a versão da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'Versão atual da aplicação.',
    schema: { example: { version: '0.0.1' } },
  })
  getVersion(): { version: string } {
    return this.appService.getVersion();
  }
}
