import { Module } from '@nestjs/common';
import { EstablishmentsController } from './controller/establishments.controller';
import { EstablishmentsService } from './service/establishments.service';
import { EstablishmentsRepository } from './repository/establishments.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule], 
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService, EstablishmentsRepository],
})
export class EstablishmentsModule {}
