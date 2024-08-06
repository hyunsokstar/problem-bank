// src/auth/dto/signup-user-dto.ts
import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from 'src/users/entities/user.entity';

export class SignUpUserDto {
    @IsEmail()
    @ApiProperty({
        description: '사용자의 이메일 주소',
        example: 'user@example.com',
    })
    email: string;

    @IsString()
    @ApiProperty({
        description: '사용자의 이름',
        example: '홍길동',
    })
    name: string;

    @IsString()
    @ApiProperty({
        description: '사용자의 비밀번호',
        example: 'password123',
    })
    password: string;

    @IsEnum(UserType)
    @IsOptional()
    @ApiProperty({
        description: '사용자의 역할 (선택 사항)',
        example: 'admin',
        required: false,
    })
    role?: UserType;
}
