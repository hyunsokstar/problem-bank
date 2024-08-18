import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateParentUserDto } from './dto/create-parent-user-dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { CreateChildrenOfParentDto } from './dto/create-children-of-parent.dto';
import { LoginResponseDto } from './dto/login-resoponse.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  @ApiOperation({ summary: '일반 사용자 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register/parent')
  @ApiOperation({ summary: '일반 사용자 부모 회원가입' })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'OK' },
        message: { type: 'string', example: '회원가입이 성공하였습니다.' },
        data: { type: 'null', example: null }
      }
    }
  })
  async registerParent(@Body() createParentUserDto: CreateParentUserDto) {
    return this.authService.createParentUser(createParentUserDto);
  }

  @Post('register/manager')
  @ApiOperation({ summary: '관리자 회원가입' })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'OK' },
        message: { type: 'string', example: '관리자 회원가입이 성공하였습니다.' },
        data: { type: 'null', example: null }
      }
    }
  })
  async registerManager(@Body() createManagerDto: CreateManagerDto) {
    return this.authService.createManagerUser(createManagerDto);
  }

  @Post('parent/children')
  @ApiOperation({ summary: '부모의 자녀 정보 등록' })
  @ApiResponse({
    status: 200,
    description: '자녀 정보 등록 성공',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'OK' },
        message: { type: 'string', example: '자녀 정보가 성공적으로 등록되었습니다.' },
        data: { type: 'null', example: null }
      }
    }
  })
  async registerChildrenOfParent(@Body() createChildrenOfParentDto: CreateChildrenOfParentDto) {
    return this.authService.createChildrenOfParent(createChildrenOfParentDto);
  }

}

