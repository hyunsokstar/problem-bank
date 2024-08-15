// src\curriculum\dto\create-subject-dto.ts
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubjectDto {
    @ApiProperty({ description: '과목 이름' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: '과목 설명' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: '활성 상태', default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}