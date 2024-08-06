import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ProblemBankService } from './problem-bank.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { CreateProblemDto } from './dto/create-problem-dto';
import { CreateAnswerOptionDto } from './dto/create-answer-option.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('problem-bank')
@ApiTags('exam')
export class ProblemBankController {
  constructor(private readonly problemBankService: ProblemBankService) { }

  @Get('exam')
  @ApiTags('exam', 'exam-GET')
  @ApiOperation({ summary: '모든 시험 조회' })
  @ApiResponse({ status: 200, description: '성공적으로 모든 시험을 조회했습니다.' })
  findAllExam() {
    return this.problemBankService.getAllExamList();
  }

  @Get('exam-only/')
  @ApiTags('exam', 'exam-GET')
  findAllExamOnly() {
    return this.problemBankService.getAllExamListOnly();
  }

  @Get('exam/:examId/problem')
  @ApiTags('exam', 'exam-GET')
  findAllProblemByExamId(@Param('examId', ParseIntPipe) examId: number) {
    return this.problemBankService.getAllProblemForExamId(examId);
  }

  @Post('exam')
  @ApiTags('exam', 'exam-POST')
  @ApiOperation({ summary: 'Create an exam' })
  @ApiResponse({ status: 201, description: 'The exam has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateExamDto })
  create(@Body() createExamDto: CreateExamDto) {
    return this.problemBankService.createOneExam(createExamDto);
  }

  @Post('exam/:examId/problems')
  @ApiOperation({ summary: '특정 시험에 대해 문제 대량 추가' })
  @ApiParam({ name: 'examId', type: 'number', description: '시험 ID' })
  @ApiBody({
    type: [CreateProblemDto],
    description: '추가할 문제들의 배열',
    examples: {
      multipleProblems: {
        summary: '여러 문제 추가 예시',
        value: [
          {
            "question": "7 + 8은 얼마인가요?",
            "correctOptionId": 3,
            "options": [
              { "text": "13" },
              { "text": "14" },
              { "text": "15" },
              { "text": "16" },
              { "text": "17" }
            ]
          },
          {
            "question": "대한민국의 수도는 어디인가요?",
            "correctOptionId": 1,
            "options": [
              { "text": "서울" },
              { "text": "부산" },
              { "text": "인천" },
              { "text": "대전" },
              { "text": "광주" }
            ]
          },
          {
            "question": "3 x 6은 얼마인가요?",
            "correctOptionId": 4,
            "options": [
              { "text": "15" },
              { "text": "16" },
              { "text": "17" },
              { "text": "18" },
              { "text": "19" }
            ]
          },
          {
            "question": "일본의 수도는 어디인가요?",
            "correctOptionId": 2,
            "options": [
              { "text": "베이징" },
              { "text": "도쿄" },
              { "text": "방콕" },
              { "text": "서울" },
              { "text": "마닐라" }
            ]
          },
          {
            "question": "세종대왕이 만든 한글의 원래 이름은 무엇인가요?",
            "correctOptionId": 5,
            "options": [
              { "text": "한글" },
              { "text": "가갸거겨" },
              { "text": "나랏말" },
              { "text": "우리말" },
              { "text": "훈민정음" }
            ]
          },
          {
            "question": "20에서 7을 빼면 얼마인가요?",
            "correctOptionId": 2,
            "options": [
              { "text": "12" },
              { "text": "13" },
              { "text": "14" },
              { "text": "15" },
              { "text": "16" }
            ]
          },
          {
            "question": "지구에서 가장 가까운 행성은 무엇인가요?",
            "correctOptionId": 3,
            "options": [
              { "text": "화성" },
              { "text": "목성" },
              { "text": "금성" },
              { "text": "토성" },
              { "text": "수성" }
            ]
          },
          {
            "question": "1년은 몇 개월인가요?",
            "correctOptionId": 4,
            "options": [
              { "text": "6개월" },
              { "text": "9개월" },
              { "text": "10개월" },
              { "text": "12개월" },
              { "text": "15개월" }
            ]
          },
          {
            "question": "우리나라 고유의 악기가 아닌 것은?",
            "correctOptionId": 5,
            "options": [
              { "text": "장구" },
              { "text": "가야금" },
              { "text": "대금" },
              { "text": "해금" },
              { "text": "피아노" }
            ]
          },
          {
            "question": "다음 중 곤충이 아닌 것은?",
            "correctOptionId": 1,
            "options": [
              { "text": "거미" },
              { "text": "개미" },
              { "text": "나비" },
              { "text": "벌" },
              { "text": "매미" }
            ]
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 201, description: '문제 대량 추가 성공' })
  @HttpCode(HttpStatus.CREATED)
  createMultiProblem(
    @Param('examId', ParseIntPipe) examId: number,
    @Body() createProblemDtos: CreateProblemDto[]
  ) {
    return this.problemBankService.createMultiProblem(examId, createProblemDtos);
  }

  @Post('exam/:examId/problem')
  @ApiTags('exam', 'exam-POST')
  @HttpCode(HttpStatus.CREATED)
  createProblem(
    @Param('examId', ParseIntPipe) examId: number,
    @Body() createProblemDto: CreateProblemDto
  ) {
    return this.problemBankService.createProblem(examId, createProblemDto);
  }

  @Post('problem/:problemId/options')
  @ApiTags('exam', 'exam-POST')
  @HttpCode(HttpStatus.CREATED)
  async createAnswerOptions(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Body() createAnswerOptionsDto: CreateAnswerOptionDto[]
  ) {
    return await this.problemBankService.createAnswerOptions(problemId, createAnswerOptionsDto);
  }

  @Post('problem/:problemId/option')
  @ApiTags('exam', 'exam-POST')
  @HttpCode(HttpStatus.CREATED)
  async createAnswerOption(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Body() createAnswerOptionDto: CreateAnswerOptionDto
  ) {
    return await this.problemBankService.createAnswerOption(problemId, createAnswerOptionDto);
  }

  @Patch('exam/:id')
  @ApiTags('exam', 'exam-PATCH')
  updateOneExam(@Param('id') id: number, @Body() updateExamDto: UpdateExamDto) {
    return this.problemBankService.updateOneExam(id, updateExamDto);
  }

  @Delete('exam/:id')
  @ApiTags('exam', 'exam-DELETE')
  @ApiOperation({ summary: '특정 시험 삭제' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeExam(@Param('id', ParseIntPipe) id: number) {
    return this.problemBankService.removeExam(id);
  }

  @Delete('problem/:id')
  @ApiTags('exam', 'exam-DELETE')
  @ApiOperation({ summary: '특정 문제 삭제' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeProblem(@Param('id', ParseIntPipe) id: number) {
    return this.problemBankService.removeProblem(id);
  }

  @Delete('exam/:id/problems')
  @ApiTags('exam', 'exam-DELETE')
  @ApiOperation({ summary: '특정 시험의 문제들 모두 삭제' })
  @ApiResponse({
    status: 204,
    description: '문제들이 성공적으로 삭제되었습니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeProblemsForExam(@Param('id', ParseIntPipe) id: number) {
    return this.problemBankService.removeProblemsForExam(id);
  }

}