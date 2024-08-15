import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { Subject } from './entities/subject.entity';
import { TeachersInfo } from 'src/users/entities/teachers-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject, TeachersInfo]),
  ],
  controllers: [CurriculumController],
  providers: [CurriculumService],
})
export class CurriculumModule { }