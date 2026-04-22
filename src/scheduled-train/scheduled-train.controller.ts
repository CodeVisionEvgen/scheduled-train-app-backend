import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateScheduledTrainDto } from './dto/create-scheduled-train.dto';
import { UpdateScheduledTrainDto } from './dto/update-scheduled-train.dto';
import { ScheduledTrainService } from './scheduled-train.service';
import { AccessTokenGuard } from 'guards/access-jwt.guard';
import { type Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { Train } from 'decorators/train-by-id.decorator';
import { TrainByIdPipe } from 'pipes/train-by-user.pipe';
import { ScheduledTrain } from './entities/scheduled-train.entity';
import { ReplaceScheduledTrainDto } from './dto/replace-scheduled-train.dto';

@Controller('scheduled-train')
export class ScheduledTrainController {
  constructor(private readonly scheduledTrainService: ScheduledTrainService) {}
  @UseGuards(AccessTokenGuard)
  @Post()
  create(
    @Body() createScheduledTrain: CreateScheduledTrainDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.scheduledTrainService.createScheduledTrain(
      createScheduledTrain,
      user,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  paginate(
    @Req() req: Request,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('query') query: string,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('departure') departure: string,
  ) {
    const user = req.user as User;
    return this.scheduledTrainService.paginateScheduledTrain(
      user,
      skip,
      limit,
      query,
      sort,
      departure,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOne(@Train(TrainByIdPipe) train: ScheduledTrain) {
    return train;
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  replace(@Train(TrainByIdPipe) train, @Body() dto: ReplaceScheduledTrainDto) {
    return this.scheduledTrainService.replaceScheduledTrain(train.id, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Train(TrainByIdPipe) train: ScheduledTrain,
    @Body() updateScheduledTrain: UpdateScheduledTrainDto,
  ) {
    return this.scheduledTrainService.updateScheduledTrain(
      train.id,
      updateScheduledTrain,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Train(TrainByIdPipe) train: ScheduledTrain) {
    return this.scheduledTrainService.deleteScheduledTrain(train.id);
  }
}
