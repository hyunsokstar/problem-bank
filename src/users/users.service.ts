import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/user.entity';
import { Repository } from 'typeorm';
import { TeachersInfo } from './entities/teachers-info.entity';
import { CreateSubjectDto } from './dto/create-subject-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(TeachersInfo)
    private readonly teachersInfoRepository: Repository<TeachersInfo>,
  ) { }

}
