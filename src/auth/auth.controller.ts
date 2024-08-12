// src\auth\auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user-dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginUserDto } from './dto/login-user-dto';
import { InsertManyUsersDto } from './dto/insert-many-users-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // 대량 회원 정보 추가 api 구현
  @Post('admin/insert-many-users')
  @ApiOperation({
    summary: '30명의 유저 데이터 대량 입력',
    description: '데이터베이스에 30명의 유저 데이터를 대량으로 입력합니다. 모든 사용자의 비밀번호는 "test1122"로 설정됩니다.'
  })
  @ApiBody({ type: InsertManyUsersDto })
  @ApiResponse({
    status: 201,
    description: '유저 데이터가 성공적으로 입력되었습니다.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '30 명의 사용자 데이터가 성공적으로 입력되었습니다.' },
        insertedCount: { type: 'number', example: 30 }
      }
    }
  })
  @ApiResponse({ status: 500, description: '서버 에러가 발생했습니다.' })
  async insertManyUsers(@Body() insertManyUsersDto: InsertManyUsersDto) {
    return await this.authService.insertManyUsers(insertManyUsersDto);
  }
}

@Post('signup')
@ApiOperation({ summary: '회원 가입' })
@ApiResponse({ status: 201, description: '회원 가입에 성공했습니다.' })
@ApiBody({ type: SignUpUserDto })
@ApiResponse({ status: 201, description: '회원 가입에 성공했습니다.' })
async signup(@Body() signUpUserDto: SignUpUserDto): Promise < { message: string } > {
  await this.authService.signup(signUpUserDto);
  return { message: '회원 가입에 성공했습니다.' };
}

@Post('login')
@ApiOperation({ summary: '로그인' })
@ApiResponse({ status: 200, description: '로그인 성공' })
@ApiResponse({ status: 401, description: '인증 실패' })
async login(@Body() loginUserDto: LoginUserDto) {
  const user = await this.authService.validateUser(loginUserDto.email, loginUserDto.password);
  return this.authService.login(user);
}

@UseGuards(JwtAuthGuard)
@Get('check-auth')
@ApiOperation({ summary: '로그인 상태 확인' })
@ApiResponse({ status: 200, description: '로그인 상태 확인 성공' })
@ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
async checkAuth(@Req() req) {
  return this.authService.checkAuth(req.user);
}

@Post('refresh')
@ApiOperation({ summary: '토큰 갱신' })
@ApiResponse({ status: 200, description: '토큰 갱신 성공' })
async refresh(@Body('refresh_token') refresh_token: string) {
  return this.authService.refreshToken(refresh_token);
}

@UseGuards(JwtAuthGuard)
@Get('profile')
@ApiOperation({ summary: '프로필 조회' })
@ApiResponse({ status: 200, description: '프로필 조회 성공' })
getProfile(@Req() req) {
  return req.user;
}

}