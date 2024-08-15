import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSubjectDto {
    @ApiProperty({
        description: '과목 이름',
        example: '수학',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: '교사 ID',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    teacherId: number;
}