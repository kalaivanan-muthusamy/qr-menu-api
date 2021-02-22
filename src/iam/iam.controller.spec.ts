import { Test, TestingModule } from '@nestjs/testing';
import { IAMController } from './iam.controller';
import { IAMService } from './iam.service';

describe('IAMController', () => {
  let controller: IAMController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IAMController],
      providers: [IAMService],
    }).compile();

    controller = module.get<IAMController>(IAMController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
