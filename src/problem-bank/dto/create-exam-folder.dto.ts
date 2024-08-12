// src/problem-bank/dto/create-exam-folder.dto.ts

import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum FolderType {
    FOLDER = 'folder',
    EXAM = 'exam'
}

export class CreateExamFolderDto {
    @ApiProperty({
        description: '폴더 이름',
        example: '폴더 이름'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: '폴더 타입',
        enum: FolderType,
        example: FolderType.FOLDER
    })
    @IsEnum(FolderType)
    type: FolderType;

    @ApiPropertyOptional({
        description: '부모 폴더 ID (최상위 폴더인 경우 생략)',
        example: 1
    })
    @IsInt()
    @IsOptional()
    parentId?: number;
}