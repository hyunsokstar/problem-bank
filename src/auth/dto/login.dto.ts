import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'user@example.com',
        description: '사용자 ID (이메일)',
    })
    @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
    userId: string;

    @ApiProperty({
        example: 'password123',
        description: '비밀번호',
    })
    @IsString()
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    password: string;
}