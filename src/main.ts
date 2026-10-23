import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Minha Lista de Compras API')
    .setDescription(
      'API para gerenciamento de listas de compras, produtos, estabelecimentos e histórico de preços.',
    )
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document)
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
