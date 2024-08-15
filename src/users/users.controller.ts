import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeneratedTeachersResponseDto } from 'src/auth/dto/generated-teachers-response.dto';
import { TeachersInfoPaginationDto } from 'src/auth/dto/teachers-info-pagination.dto';
import { CreateSubjectDto } from './dto/create-subject-dto';
import { TeacherListQueryDto } from './dto/teacher-list-query-dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // GET 영역
  // 교사 정보 목록 조회
  @Get('teachers')
  @ApiTags('teacher-GET')
  @ApiOperation({ summary: '교사 정보 목록 조회', description: '페이지네이션과 검색 기능을 포함한 교사 정보 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '교사 정보 목록 조회 성공', type: TeachersInfoPaginationDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 파라미터' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  async getTeachersInfoList(@Query() query: TeacherListQueryDto): Promise<TeachersInfoPaginationDto> {
    const { page, perPage, searchTerm, searchType } = query;
    return this.usersService.getTeachersInfoList(page, perPage, searchTerm, searchType);
  }

  // 테스트용 데이터 그리드 조회
  @Get('test-data-grid')
  async getUsersForTestDataGrid(
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
  ) {
    return await this.usersService.findUsersForTestDataGrid(page, size);
  }

  // 모든 유저 조회
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 무작위 교사 정보 생성
  @Post('generate-random-teachers')
  @ApiOperation({ summary: 'Generate and create 10 random teacher info' })
  @ApiResponse({
    status: 201,
    description: 'Random teacher info list has been successfully created.',
    type: GeneratedTeachersResponseDto
  })
  @ApiTags('teacher-POST')
  async generateRandomTeachers() {
    return this.usersService.generateAndCreateRandomTeachers();
  }

  // DELETE 영역
  // 모든 유저 삭제
  @Delete('admin/delete-all-users')
  @ApiOperation({ summary: '모든 유저 삭제', description: '데이터베이스에서 모든 유저를 삭제합니다.' })
  @ApiResponse({ status: 200, description: '모든 유저가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 500, description: '서버 에러가 발생했습니다.' })
  async deleteAllUsers() {
    return await this.usersService.deleteAllUsers();
  }
}
