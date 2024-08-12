import { Module } from '@nestjs/common';
import { ProblemBankService } from './problem-bank.service';
import { ProblemBankController } from './problem-bank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/user.entity';
import { Exam } from './entities/exam.entity';
import { Problem } from './entities/problem.entity';
import { Answer } from './entities/answer.entity';
import { Result } from './entities/result.entity';
import { AnswerOption } from './entities/answer-option.entity';
import { ExamFolder } from './entities/exam-folder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersModel,
      Exam,
      ExamFolder,
      Problem,
      AnswerOption,
      Answer,
      Result
    ]),
  ],

  controllers: [ProblemBankController],
  providers: [ProblemBankService],
})
export class ProblemBankModule { }
