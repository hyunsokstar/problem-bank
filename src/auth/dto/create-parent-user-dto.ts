// src/users/dto/create-parent-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateParentUserDto {
    @ApiProperty({
        example: 'abc01@gmail.com',
        description: '이메일 형식의 사용자 ID',
    })
    @IsEmail()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        example: '!Abc1234',
        description: '8자리 이상 16자리 이하, 영문 대/소문자, 숫자, 특수문자 중 3개이상 조합',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({
        example: '길동',
        description: '사용자 이름',
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        example: '홍',
        description: '사용자 성',
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;
}