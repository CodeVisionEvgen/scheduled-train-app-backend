import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { SCHEDULED_TRAIN_NOT_FOUND } from 'src/scheduled-train/scheduled-train.constants';
import { ScheduledTrainService } from 'src/scheduled-train/scheduled-train.service';
import { User } from 'src/user/entities/user.entity';

type IPayload = {
  id: number;
  user: User;
};

@Injectable()
export class TrainByIdPipe implements PipeTransform<IPayload> {
  constructor(private readonly service: ScheduledTrainService) {}

  async transform(payload: IPayload) {
    const train = await this.service.getScheduledTrainById(payload.id);
    const user = payload.user;
    console.log(train);
    if (!train || train.user.id !== user.id) {
      throw new NotFoundException(SCHEDULED_TRAIN_NOT_FOUND);
    }

    return train;
  }
}
