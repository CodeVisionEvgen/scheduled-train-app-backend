import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('scheduled_train')
export class ScheduledTrain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  number: string;

  @Column({
    nullable: false,
  })
  from: string;
  @Column({
    nullable: false,
  })
  to: string;
  @Column({
    nullable: false,
  })
  departure: string;
  @Column({
    nullable: false,
  })
  arrival: string;

  @ManyToOne(() => User, (user) => user.scheduled_trains, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
