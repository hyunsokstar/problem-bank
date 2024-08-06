import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, ArrayMinSize, ArrayMaxSize, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateAnswerOptionDto {
    @ApiProperty({
        example: '파리',
        description: '답변 옵션 텍스트'
    })
    @IsString()
    text: string;
}

export class CreateProblemDto {

    @ApiProperty({
        example: 1,
        required: true,
        description: '문제 번호 (1부터 시작)'
    })
    order: number;

    @ApiProperty({
        example: '프랑스의 수도는 어디인가요?',
        description: '문제 텍스트'
    })
    @IsString()
    question: string;

    @ApiProperty({
        example: 'http://example.com/image.png',
        required: false,
        description: '문제와 관련된 이미지 URL (선택사항)'
    })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({
        example: 1,
        description: '정답 옵션의 ID (1부터 5까지)',
        minimum: 1,
        maximum: 5
    })
    @IsNumber()
    @Min(1)
    @Max(5)
    correctOptionId: number;

    @ApiProperty({
        type: [CreateAnswerOptionDto],
        description: '5개의 답변 옵션',
        example: [
            { text: '파리' },
            { text: '베를린' },
            { text: '마드리드' },
            { text: '로마' },
            { text: '런던' },
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(5)
    @ArrayMaxSize(5)
    @Type(() => CreateAnswerOptionDto)
    options: CreateAnswerOptionDto[];
}