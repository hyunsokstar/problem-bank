import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { SignUpUserDto } from './dto/signup-user-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private jwtService: JwtService
  ) { }

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
