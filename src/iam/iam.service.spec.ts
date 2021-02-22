import { Test, TestingModule } from '@nestjs/testing';
import { IAMService } from './iam.service';

describe('IAMService', () => {
  let service: IAMService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IAMService],
    }).compile();

    service = module.get<IAMService>(IAMService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
