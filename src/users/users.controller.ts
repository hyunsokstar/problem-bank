import { Controller, Delete, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // 모든 유저 삭제
  @Delete('admin/delete-all-users')
  @ApiOperation({ summary: '모든 유저 삭제', description: '데이터베이스에서 모든 유저를 삭제합니다.' })
  @ApiResponse({ status: 200, description: '모든 유저가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 500, description: '서버 에러가 발생했습니다.' })
  async deleteAllUsers() {
    return await this.usersService.deleteAllUsers();
  }

  @Get('test-data-grid')
  async getUsersForTestDataGrid(
    @Query('page') page: number = 0,
    @Query('size') size: number = 3,
  ) {
    return await this.usersService.findUsersForTestDataGrid(page, size);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('teachers')
  findTeachers() {
    return this.usersService.findTeachers();
  }
}