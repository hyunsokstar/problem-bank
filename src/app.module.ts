import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './users/entities/user.entity';
import { RequestLoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProblemBankModule } from './problem-bank/problem-bank.module';
import { Exam } from './problem-bank/entities/exam.entity';
import { Problem } from './problem-bank/entities/problem.entity';
import { Answer } from './problem-bank/entities/answer.entity';
import { Result } from './problem-bank/entities/result.entity';
import { AnswerOption } from './problem-bank/entities/answer-option.entity';
import { ExamFolder } from './problem-bank/entities/exam-folder.entity';
import { TeachersInfo } from './users/entities/teachers-info.entity';
import { CurriculumModule } from './curriculum/curriculum.module';
import { Subject } from './curriculum/entities/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "127.0.0.1",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "ddankumi_db",
      entities: [
        UsersModel,
        ExamFolder,
        Exam,
        Problem,
        AnswerOption,
        Answer,
        Result,
        TeachersInfo,
        Subject
      ],
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'your_jwt_secret',  // 실제 환경에서는 환경 변수 사용 권장
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    AuthModule,
    ProblemBankModule,
    CurriculumModule],
  controllers: [AppController],
  providers: [AppService],
})

// export class AppModule { }

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
