import { Controller, Post, Body, Delete, HttpCode, Param, Get, Query } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateSubjectDto } from './dto/create-subject-dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('curriculum')
@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) { }

  @Get('subjects')
  @ApiOperation({ summary: '과목 리스트 조회' })
  @ApiResponse({ status: 200, description: '과목 리스트가 성공적으로 조회되었습니다.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '페이지 번호 (기본값: 1)' })
  @ApiQuery({ name: 'perPage', required: false, type: Number, description: '페이지당 항목 수 (기본값: 10)' })
  @ApiTags('curriculum-GET')
  async findAllSubjects(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10
  ) {
    return this.curriculumService.findAllSubjects(page, perPage);
  }

  @Delete('subjects/:id')
  @HttpCode(204)
  @ApiOperation({ summary: '특정 과목 삭제' })
  @ApiParam({ name: 'id', type: 'number', description: '삭제할 과목의 ID' })
  @ApiResponse({ status: 204, description: '과목이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '해당 ID의 과목을 찾을 수 없습니다.' })
  @ApiTags('curriculum-DELETE')
  async deleteSubject(@Param('id') id: number) {
    await this.curriculumService.deleteSubject(id);
  }

  @Post('subjects')
  @ApiOperation({ summary: '새로운 과목 추가' })
  @ApiResponse({ status: 201, description: '과목이 성공적으로 추가되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 입력 데이터' })
  @ApiTags('curriculum-POST')
  async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.curriculumService.createSubject(createSubjectDto);
  }

}