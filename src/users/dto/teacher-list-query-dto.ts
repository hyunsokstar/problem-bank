import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TeacherListQueryDto {
    @ApiPropertyOptional({ description: '페이지 번호 (기본값: 0)', default: 0 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional({ description: '페이지당 항목 수 (기본값: 20)', default: 20 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    perPage?: number;

    @ApiPropertyOptional({ description: '검색어' })
    @IsOptional()
    @IsString()
    searchTerm?: string;

    @ApiPropertyOptional({ description: '검색 유형 (기본값: teacherName)', default: 'teacherName' })
    @IsOptional()
    @IsString()
    searchType?: string;
}