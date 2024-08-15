import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entities/user.entity';
import { TeachersInfo } from './entities/teachers-info.entity';
import { Subject } from 'src/curriculum/entities/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersModel,
      TeachersInfo,
      Subject
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
