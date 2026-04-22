import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  findOneById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }
  findOneByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  createUser(createUserDto: CreateUserDto) {
    return this.userRepo.save(createUserDto);
  }
}
