import { ApiProperty } from '@nestjs/swagger';
import { Exam } from '../entities/exam.entity';

export class ExamResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Exam created successfully' })
    message: string;

    @ApiProperty({
        example: {
            id: 1,
            name: '2023년 2학기 기말고사',
            createdAt: '2023-08-05T14:30:00Z',
            examiner: { id: 15 }
        }
    })
    data: Exam;
}