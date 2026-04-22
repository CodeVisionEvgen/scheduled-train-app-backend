import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduledTrainDto } from './create-scheduled-train.dto';

export class UpdateScheduledTrainDto extends PartialType(
  CreateScheduledTrainDto,
) {}
