import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole, UsersModel } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateParentUserDto } from './dto/create-parent-user-dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { CreateChildrenOfParentDto } from './dto/create-children-of-parent.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-resoponse.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private jwtService: JwtService
  ) { }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { userId, password } = loginDto;
    // 사용자 찾기
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 잘못되었습니다.');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 잘못되었습니다.');
    }

    // JWT 토큰 생성
    const accessToken = this.jwtService.sign({ userId: user.userId, sub: user.id });
    const refreshToken = this.jwtService.sign({ userId: user.userId, sub: user.id }, { expiresIn: '24h' });

    return {
      code: 'OK',
      message: '요청이 성공하였습니다.',
      data: {
        access: {
          token: accessToken,
          expiresIn: 3600, // 1시간
        },
        refresh: {
          token: refreshToken,
          expiresIn: 86400, // 24시간
        },
      },
    };
  }

  async createParentUser(createParentUserDto: CreateParentUserDto) {
    const { userId, password, firstName, lastName } = createParentUserDto;
    return this.createUser({ userId, password, firstName, lastName, userRole: null });
  }

  async createManagerUser(createManagerDto: CreateManagerDto) {
    const { userId, password, firstName, lastName, userRole, teacherCode } = createManagerDto;
    return this.createUser({ userId, password, firstName, lastName, userRole, teacherCode });
  }

  private async createUser(userData: Partial<UsersModel>) {
    const existingUser = await this.usersRepository.findOne({ where: { userId: userData.userId } });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 사용자입니다.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await this.usersRepository.save(newUser);

    return {
      code: 'OK',
      message: '회원가입이 성공하였습니다.',
      data: null
    };
  }

  async createChildrenOfParent(createChildrenOfParentDto: CreateChildrenOfParentDto) {
    const { userId, password, firstName, lastName, birthDate, grade, phoneNumber, parentId } = createChildrenOfParentDto;

    const existingUser = await this.usersRepository.findOne({ where: { userId } });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 사용자입니다.');
    }

    const parent = await this.usersRepository.findOne({ where: { id: parentId, userRole: UserRole.PARENT } });
    if (!parent) {
      throw new NotFoundException('유효한 부모 사용자를 찾을 수 없습니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({
      userId,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate: new Date(birthDate),
      grade,
      phoneNumber,
      userRole: UserRole.CHILD,
      parentId
    });

    await this.usersRepository.save(newUser);

    return {
      code: 'OK',
      message: '자녀 정보가 성공적으로 등록되었습니다.',
      data: null
    };
  }


}