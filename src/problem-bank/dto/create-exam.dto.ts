import { IsString, IsInt, IsArray, IsOptional, IsDateString, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExamDto {
    @ApiProperty({
        description: '시험 이름',
        example: '2023년 2학기 기말고사'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: '시험 출제자 ID',
        example: 1
    })
    @IsInt()
    examinerId: number;

    @ApiPropertyOptional({
        description: '시험 생성 날짜 (옵션)',
        example: '2023-08-05T14:30:00Z'
    })
    @IsDateString()
    @IsOptional()
    createdAt?: Date;
}