import { Module } from '@nestjs/common';
import { ScheduledTrainController } from './scheduled-train.controller';
import { ScheduledTrainService } from './scheduled-train.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledTrain } from './entities/scheduled-train.entity';
import { AccessTokenStrategy } from 'straregies/access-jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ScheduledTrainController],
  providers: [ScheduledTrainService, AccessTokenStrategy],
  imports: [
    TypeOrmModule.forFeature([ScheduledTrain]),
    ConfigModule,
    UserModule,
  ],
})
export class ScheduledTrainModule {}
