import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, Min, Max, IsEnum } from 'class-validator';

export class CreateChildrenOfParentDto {
    @ApiProperty({ description: '이메일 형식의 사용자 ID' })
    @IsString()
    userId: string;

    @ApiProperty({ description: '비밀번호' })
    @IsString()
    password: string;

    @ApiProperty({ description: '사용자 이름' })
    @IsString()
    firstName: string;

    @ApiProperty({ description: '사용자 성' })
    @IsString()
    lastName: string;

    @ApiProperty({ description: '생년월일', example: 'YYYY-MM-DD' })
    @IsDateString()
    birthDate: string;

    @ApiProperty({ description: '학년', minimum: 1, maximum: 12 })
    @IsNumber()
    @Min(1)
    @Max(12)
    grade: number;

    @ApiProperty({ description: '전화번호' })
    @IsString()
    phoneNumber: string;

    @ApiProperty({ description: '부모 ID' })
    @IsNumber()
    parentId: number;
}