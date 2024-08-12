import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel, UserType } from 'src/users/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { SignUpUserDto } from './dto/signup-user-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InsertManyUsersDto } from './dto/insert-many-users-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private jwtService: JwtService
  ) { }

  async signup(signUpUserDto: SignUpUserDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(signUpUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...signUpUserDto,
      email: signUpUserDto.email.trim(),
      role: signUpUserDto.role,
      password: hashedPassword,
    });
    await this.usersRepository.save(newUser);
  }

  async insertManyUsers(insertManyUsersDto: InsertManyUsersDto): Promise<{ message: string; insertedCount: number }> {
    const { emailDomain = 'example.com', namePrefix = 'User' } = insertManyUsersDto;
    const users: Partial<UsersModel>[] = [];

    const hashedPassword = await bcrypt.hash('test1122', 10);

    for (let i = 0; i < 30; i++) {
      const uniqueIdentifier = this.generateUniqueIdentifier();
      const email = `${namePrefix.toLowerCase()}${uniqueIdentifier}@${emailDomain}`;

      users.push({
        email,
        name: `${namePrefix} ${i + 1}`,
        password: hashedPassword,
        role: UserType.ADMIN,
      });
    }

    const insertedUsers = await this.usersRepository.save(users);
    return {
      message: `${insertedUsers.length} 명의 사용자 데이터가 성공적으로 입력되었습니다.`,
      insertedCount: insertedUsers.length,
    };
  }

  private generateUniqueIdentifier(): string {
    // 현재 시간을 밀리초 단위로 가져와 16진수로 변환
    const timestamp = Date.now().toString(16);
    // 랜덤한 숫자를 생성하여 16진수로 변환
    const randomPart = Math.floor(Math.random() * 1000000).toString(16);
    return `${timestamp}${randomPart}`;
  }

  async login(user: any) {
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const payload = { email: user.email, sub: user.id, name: user.name, role: user.role };

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async checkAuth(user: any) {
    if (!user) {
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');
    }

    // 사용자 정보에서 필요한 부분만 선택하여 반환
    const { id, email, name, role } = user;

    console.log("user at checkAuth : ", user);

    return { id, email, name, role, isAuthenticated: true };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const trimmedEmail = email.trim();
    const user = await this.usersRepository.findOne({
      where: {
        email: ILike(trimmedEmail)
      }
    });

    console.log("email : ", email);
    console.log("password : ", password);


    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async refreshToken(refresh_token: string) {
    try {
      const payload = await this.jwtService.verify(refresh_token);
      const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const newPayload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }


}
