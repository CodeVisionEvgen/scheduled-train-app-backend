import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledTrainController } from './scheduled-train.controller';

describe('ScheduledTrainController', () => {
  let controller: ScheduledTrainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledTrainController],
    }).compile();

    controller = module.get<ScheduledTrainController>(ScheduledTrainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
