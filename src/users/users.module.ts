import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entities/user.entity';
import { TeachersInfo } from './entities/teachers-info.entity';
import { TeacherSubject } from './entities/teacher-subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersModel,
      TeachersInfo,
      TeacherSubject
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
