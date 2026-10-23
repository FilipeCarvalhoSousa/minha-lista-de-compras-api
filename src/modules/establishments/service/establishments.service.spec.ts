import { Test, TestingModule } from '@nestjs/testing';
import { EstablishmentsService } from './establishments.service';
import { EstablishmentsRepository } from '../repository/establishments.repository';

describe('EstablishmentsService', () => {
  let service: EstablishmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstablishmentsService,
        { provide: EstablishmentsRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<EstablishmentsService>(EstablishmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
