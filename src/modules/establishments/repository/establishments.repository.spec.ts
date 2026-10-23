import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../../database/service/database.service';
import { EstablishmentsRepository } from './establishments.repository';

describe('EstablishmentsRepository', () => {
  let repository: EstablishmentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstablishmentsRepository,
        { provide: DatabaseService, useValue: { db: {} } },
      ],
    }).compile();

    repository = module.get<EstablishmentsRepository>(EstablishmentsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
