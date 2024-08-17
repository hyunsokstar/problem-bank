import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeneratedTeachersResponseDto } from 'src/auth/dto/generated-teachers-response.dto';
import { TeachersInfoPaginationDto } from 'src/auth/dto/teachers-info-pagination.dto';
import { CreateSubjectDto } from './dto/create-subject-dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


}
