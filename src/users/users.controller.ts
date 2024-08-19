import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTeachersInfoDto } from 'src/auth/dto/create-teacher-info.dto';
import { GeneratedTeachersResponseDto } from 'src/auth/dto/generated-teachers-response.dto';
import { TeachersInfoPaginationDto } from 'src/auth/dto/teachers-info-pagination.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('test-data-grid')
  @ApiTags('users/get')
  @ApiOperation({ summary: 'Get users for test data grid' })
  @ApiResponse({ status: 200, description: 'Returns users for test data grid' })
  async getUsersForTestDataGrid(
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
  ) {
    return await this.usersService.findUsersForTestDataGrid(page, size);
  }

  @Get('teachers')
  @ApiOperation({ summary: 'Get teachers info list with pagination and search' })
  @ApiResponse({ status: 200, type: TeachersInfoPaginationDto })
  async getTeachersInfoList(
    @Query('page') page: number = 0,
    @Query('perPage') perPage: number = 20,
    @Query('searchTerm') searchTerm: string = '',
    @Query('searchType') searchType: string = 'teacherName'
  ): Promise<TeachersInfoPaginationDto> {
    return this.usersService.getTeachersInfoList(page, perPage, searchTerm, searchType);
  }

  @Post('generate-random-teachers')
  @ApiOperation({ summary: 'Generate and create 10 random teacher info' })
  @ApiResponse({
    status: 201,
    description: 'Random teacher info list has been successfully created.',
    type: GeneratedTeachersResponseDto
  })
  async generateRandomTeachers() {
    return this.usersService.generateAndCreateRandomTeachers();
  }

  // 모든 유저 삭제
  @Delete('admin/delete-all-users')
  @ApiOperation({ summary: '모든 유저 삭제', description: '데이터베이스에서 모든 유저를 삭제합니다.' })
  @ApiResponse({ status: 200, description: '모든 유저가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 500, description: '서버 에러가 발생했습니다.' })
  async deleteAllUsers() {
    return await this.usersService.deleteAllUsers();
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

}