// src/problem-bank/dto/create-multiple-exam-folders.dto.ts

import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateExamFolderDto } from './create-exam-folder.dto';

export class CreateMultipleExamFoldersDto {
    @ApiProperty({
        type: [CreateExamFolderDto],
        description: '생성할 여러 폴더들의 정보',
        example: [
            {
                name: '9까지의 수',
                type: 'folder',
                parentId: null  // 최상위 폴더
            },
            {
                name: '여러가지 모양',
                type: 'folder',
                parentId: 1  // '9까지의 수' 폴더의 하위 폴더로 가정
            },
            {
                name: '덧셈과 뺄셈',
                type: 'folder',
                parentId: 1  // '9까지의 수' 폴더의 하위 폴더로 가정
            }
        ]
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateExamFolderDto)
    folders: CreateExamFolderDto[];
}