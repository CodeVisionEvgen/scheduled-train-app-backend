import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledTrainService } from './scheduled-train.service';

describe('ScheduledTrainService', () => {
  let service: ScheduledTrainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledTrainService],
    }).compile();

    service = module.get<ScheduledTrainService>(ScheduledTrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
