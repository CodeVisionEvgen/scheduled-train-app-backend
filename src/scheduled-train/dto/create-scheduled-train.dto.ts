import { IsDateString, IsString } from 'class-validator';

export class CreateScheduledTrainDto {
  @IsString()
  number: string;
  @IsString()
  from: string;
  @IsString()
  to: string;
  @IsDateString()
  departure: string;
  @IsDateString()
  arrival: string;
}
