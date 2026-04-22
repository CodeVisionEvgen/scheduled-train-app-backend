import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduledTrain } from './entities/scheduled-train.entity';
import { Repository } from 'typeorm';
import { CreateScheduledTrainDto } from './dto/create-scheduled-train.dto';
import { UpdateScheduledTrainDto } from './dto/update-scheduled-train.dto';
import { SCHEDULED_TRAIN_NOT_FOUND } from './scheduled-train.constants';
import { User } from 'src/user/entities/user.entity';
import { ReplaceScheduledTrainDto } from './dto/replace-scheduled-train.dto';

@Injectable()
export class ScheduledTrainService {
  constructor(
    @InjectRepository(ScheduledTrain)
    private readonly scheduledTrainRepo: Repository<ScheduledTrain>,
  ) {}

  async paginateScheduledTrain(
    user: User,
    skip = 0,
    limit = 10,
    query?: string,
    sort: 'ASC' | 'DESC' = 'DESC',
    departure?: string,
  ) {
    const qb = this.scheduledTrainRepo
      .createQueryBuilder('train')
      .leftJoin('train.user', 'user')
      .where('user.id = :userId', { userId: user.id });

    if (query) {
      qb.andWhere(
        `(train.number ILIKE :query 
        OR train.from ILIKE :query 
        OR train.to ILIKE :query)`,
        { query: `%${query}%` },
      );
    }

    if (departure) {
      const start = new Date(departure);
      start.setHours(0, 0, 0, 0);

      const end = new Date(departure);
      end.setHours(23, 59, 59, 999);

      qb.andWhere('train.departure BETWEEN :start AND :end', {
        start,
        end,
      });
    }
    if (sort) {
      qb.orderBy('train.departure', sort);
    }

    qb.skip(skip).take(limit);

    const [trains, count] = await qb.getManyAndCount();

    return {
      trains,
      count,
      limit,
    };
  }

  getScheduledTrainById(trainId: number) {
    return this.scheduledTrainRepo.findOne({
      where: { id: trainId },
      relations: ['user'],
      select: {
        id: true,
        number: true,
        from: true,
        to: true,
        departure: true,
        arrival: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          email: true,
        },
      },
    });
  }

  createScheduledTrain(
    createScheduledTrainDto: CreateScheduledTrainDto,
    user: User,
  ): Promise<ScheduledTrain> {
    return this.scheduledTrainRepo.save({ ...createScheduledTrainDto, user });
  }

  async replaceScheduledTrain(
    trainId: number,
    dto: ReplaceScheduledTrainDto,
  ): Promise<ScheduledTrain> {
    const train = await this.scheduledTrainRepo.findOne({
      where: { id: trainId },
    });

    if (!train) {
      throw new NotFoundException(SCHEDULED_TRAIN_NOT_FOUND);
    }

    const replaced = this.scheduledTrainRepo.create({
      id: trainId,
      ...dto,
    });

    return this.scheduledTrainRepo.save(replaced);
  }

  async updateScheduledTrain(
    trainId: number,
    updateScheduledTrainDto: UpdateScheduledTrainDto,
  ): Promise<ScheduledTrain> {
    const train = await this.scheduledTrainRepo.findOne({
      where: { id: trainId },
    });

    if (!train) {
      throw new NotFoundException(SCHEDULED_TRAIN_NOT_FOUND);
    }

    const updated = this.scheduledTrainRepo.merge(
      train,
      updateScheduledTrainDto,
    );

    return this.scheduledTrainRepo.save(updated);
  }

  deleteScheduledTrain(trainId: number) {
    return this.scheduledTrainRepo.delete({
      id: trainId,
    });
  }
}
